const JogoDAO = require('../dao/JogoDAO');
const CompeticaoDAO = require('../dao/CompeticaoDAO');
const AtletaDAO = require('../dao/AtletaDAO');
const SetJogoDAO = require('../dao/SetJogoDAO');
const httpError = require('../utils/httpError');

function normalizePhase(phase) {
    return String(phase || '').toUpperCase();
}

function getNextEliminationPhase(currentPhase) {
    const phase = normalizePhase(currentPhase);
    const suffixes = ['OITAVAS_FINAL', 'QUARTAS_FINAL', 'SEMI_FINAL', 'FINAL'];

    const suffix = suffixes.find((item) => phase.endsWith(item));
    if (!suffix) return null;

    const prefix = phase.slice(0, phase.length - suffix.length);

    if (suffix === 'FINAL') return '__END__';
    if (suffix === 'SEMI_FINAL') return `${prefix}FINAL`;
    if (suffix === 'QUARTAS_FINAL') return `${prefix}SEMI_FINAL`;
    if (suffix === 'OITAVAS_FINAL') return `${prefix}QUARTAS_FINAL`;
    return null;
}

function getLoserPlacementPoints(phase) {
    const normalized = normalizePhase(phase);

    if (normalized.endsWith('SEMI_FINAL')) return 10;
    if (normalized.endsWith('QUARTAS_FINAL')) return 7;
    if (normalized.endsWith('OITAVAS_FINAL')) return 5;
    return 0;
}

function parseByeIds(observacoes) {
    const text = String(observacoes || '');
    const match = text.match(/BYE_IDS:([0-9,]+)/);
    if (!match) return [];

    return match[1]
        .split(',')
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0);
}

function stripByeTag(observacoes) {
    return String(observacoes || '').replace(/\|?BYE_IDS:[0-9,]*/g, '').trim();
}

function composeObservacoes(baseObservacoes, byeIds) {
    const base = stripByeTag(baseObservacoes);
    const uniqueByeIds = [...new Set((byeIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];

    if (!uniqueByeIds.length) {
        return base || null;
    }

    const byeTag = `BYE_IDS:${uniqueByeIds.join(',')}`;
    return base ? `${base}|${byeTag}` : byeTag;
}

class JogoService {
    async _applyFinalRankingPoints(competicaoId) {
        const allElims = await JogoDAO.findEliminatoriasByCompeticao(competicaoId);
        if (!allElims.length) return;

        // IMPORTANTE: No SPING_OPEN, cada nível (A/B/C/D) tem sua própria FINAL.
        // Preciso contar pontos apenas para atletas que finalizaram sua FINAL específica,
        // não para todos os eliminatórios. Agrupar por categoria/nível.

        const finished = allElims.filter((m) => (m.status === 'FINALIZADO' || m.status === 'W_O') && m.vencedor_id);
        if (!finished.length) return;

        // Agrupar por nível extraído da fase
        const finishedByLevel = new Map();

        for (const match of finished) {
            const faseUpper = String(match.fase || '').toUpperCase();
            let level = '';

            if (faseUpper.includes('OPEN_A') || faseUpper.includes('NIVEL_A')) level = 'A';
            else if (faseUpper.includes('OPEN_B') || faseUpper.includes('NIVEL_B')) level = 'B';
            else if (faseUpper.includes('OPEN_C') || faseUpper.includes('NIVEL_C')) level = 'C';
            else if (faseUpper.includes('OPEN_D') || faseUpper.includes('NIVEL_D')) level = 'D';

            if (!finishedByLevel.has(level)) {
                finishedByLevel.set(level, []);
            }
            finishedByLevel.get(level).push(match);
        }

        // Verificar se TODOS os níveis estão finalizados (para SPING_OPEN)
        const hasOpenLevels = finishedByLevel.has('A') || finishedByLevel.has('B') ||
                             finishedByLevel.has('C') || finishedByLevel.has('D');

        // Se é SPING_OPEN, só contar pontos quando TODOS os níveis estão finalizados
        if (hasOpenLevels) {
            const levelA = finishedByLevel.get('A') || [];
            const levelB = finishedByLevel.get('B') || [];
            const levelC = finishedByLevel.get('C') || [];
            const levelD = finishedByLevel.get('D') || [];

            const allLevelsHaveFinal =
                levelA.some(m => m.fase.toUpperCase().includes('FINAL')) &&
                levelB.some(m => m.fase.toUpperCase().includes('FINAL')) &&
                levelC.some(m => m.fase.toUpperCase().includes('FINAL')) &&
                levelD.some(m => m.fase.toUpperCase().includes('FINAL'));

            // Se faltam níveis, não processa ainda
            if (!allLevelsHaveFinal) {
                return;
            }
        }

        // Processar pontos apenas para jogos finalizados que chegaram à FINAL
        const pointsByAthlete = new Map();
        const addPoints = (athleteId, points) => {
            if (!athleteId || points <= 0) return;
            pointsByAthlete.set(athleteId, (pointsByAthlete.get(athleteId) || 0) + points);
        };

        for (const match of finished) {
            const phase = normalizePhase(match.fase);

            if (phase.endsWith('FINAL')) {
                const winnerId = match.vencedor_id;
                const loserId = winnerId === match.atleta_a_id ? match.atleta_b_id : match.atleta_a_id;
                addPoints(winnerId, 20);
                addPoints(loserId, 14);
                continue;
            }

            const loserId = match.vencedor_id === match.atleta_a_id ? match.atleta_b_id : match.atleta_a_id;
            addPoints(loserId, getLoserPlacementPoints(phase));
        }

        for (const [athleteId, points] of pointsByAthlete.entries()) {
            await AtletaDAO.addRankingPoints(athleteId, points);
        }
    }

    async _advanceKnockoutIfNeeded(jogo) {
        const phase = normalizePhase(jogo.fase);
        if (phase.startsWith('GRUPO_')) {
            return;
        }

        const phaseMatches = await JogoDAO.findByCompeticaoAndFase(jogo.competicao_id, jogo.fase);
        if (!phaseMatches.length) {
            return;
        }

        const phaseFinished = phaseMatches.every(
            (match) => (match.status === 'FINALIZADO' || match.status === 'W_O') && match.vencedor_id
        );

        if (!phaseFinished) {
            return;
        }

        const nextPhase = getNextEliminationPhase(jogo.fase);
        if (!nextPhase) {
            return;
        }

        if (nextPhase === '__END__') {
            const allElims = await JogoDAO.findEliminatoriasByCompeticao(jogo.competicao_id);
            const allFinished = allElims.every(
                (m) => (m.status === 'FINALIZADO' || m.status === 'W_O') && m.vencedor_id
            );

            if (allFinished) {
                const competicao = await CompeticaoDAO.findById(jogo.competicao_id);
                if (competicao && competicao.status !== 'FINALIZADA') {
                    await this._applyFinalRankingPoints(jogo.competicao_id);
                    await CompeticaoDAO.update(jogo.competicao_id, { status: 'FINALIZADA' });
                }
            }
            return;
        }

        const existingNext = await JogoDAO.findByCompeticaoAndFase(jogo.competicao_id, nextPhase);
        if (existingNext.length) {
            return;
        }

        const winners = [...phaseMatches]
            .sort((a, b) => (a.rodada ?? 0) - (b.rodada ?? 0) || a.id - b.id)
            .map((match) => match.vencedor_id)
            .filter(Boolean);

        const inheritedByeIds = parseByeIds(phaseMatches[0]?.observacoes);
        inheritedByeIds.forEach((id) => {
            if (!winners.includes(id)) {
                winners.push(id);
            }
        });

        const nextMatches = [];
        const nextPhaseByeIds = [];
        const baseObservacoes = stripByeTag(phaseMatches[0]?.observacoes);

        for (let i = 0; i < winners.length; i += 2) {
            const atletaA = winners[i];
            const atletaB = winners[i + 1];
            if (!atletaB) {
                // BYE: atleta sem par avanca implicitamente para a proxima fase.
                if (atletaA) nextPhaseByeIds.push(atletaA);
                continue;
            }

            nextMatches.push({
                competicao_id: jogo.competicao_id,
                fase: nextPhase,
                rodada: i / 2 + 1,
                atleta_a_id: atletaA,
                atleta_b_id: atletaB,
                status: 'AGENDADO',
                observacoes: null
            });
        }

        if (!nextMatches.length) {
            return;
        }

        const nextObservacoes = composeObservacoes(baseObservacoes, nextPhaseByeIds);
        nextMatches.forEach((match) => {
            match.observacoes = nextObservacoes;
        });

        await JogoDAO.createMany(nextMatches);
    }

    async getAll() {
        return JogoDAO.findAll();
    }

    async getById(id) {
        const jogo = await JogoDAO.findById(id);
        if (!jogo) {
            throw httpError('Jogo nao encontrado', 404);
        }
        return jogo;
    }

    async validateReferences(data) {
        const competicao = await CompeticaoDAO.findById(data.competicao_id);
        if (!competicao) {
            throw httpError('Competicao nao encontrada', 404);
        }

        const atletaA = await AtletaDAO.findById(data.atleta_a_id);
        if (!atletaA) {
            throw httpError('Atleta A nao encontrado', 404);
        }

        // Allow missing atleta_b_id for explicit BYE matches or walkovers (W_O)
        // If atleta_b_id is null/undefined and the payload indicates a BYE or W_O,
        // skip the atleta B existence check. Otherwise, atleta B must exist.
        if (data.atleta_b_id === undefined || data.atleta_b_id === null) {
            const isBye = data.bye === true || data.status === 'W_O' || data.vencedor_id === data.atleta_a_id;
            if (!isBye) {
                throw httpError('Atleta B nao encontrado', 404);
            }
        } else {
            const atletaB = await AtletaDAO.findById(data.atleta_b_id);
            if (!atletaB) {
                throw httpError('Atleta B nao encontrado', 404);
            }
        }

        if (data.atleta_a_id === data.atleta_b_id) {
            throw httpError('Atletas do jogo devem ser diferentes', 400);
        }

        if (data.vencedor_id !== undefined && data.vencedor_id !== null) {
            if (data.vencedor_id !== data.atleta_a_id && data.vencedor_id !== data.atleta_b_id) {
                throw httpError('Vencedor precisa ser atleta_a_id ou atleta_b_id', 400);
            }
        }
    }

    async create(data) {
        // Support creating BYE matches: when data.bye is true, only atleta_a is required
        if (data && data.bye) {
            const competicao = await CompeticaoDAO.findById(data.competicao_id);
            if (!competicao) {
                throw httpError('Competicao nao encontrada', 404);
            }

            const atletaA = await AtletaDAO.findById(data.atleta_a_id);
            if (!atletaA) {
                throw httpError('Atleta A nao encontrado', 404);
            }

            const payload = {
                competicao_id: data.competicao_id,
                fase: data.fase,
                rodada: data.rodada ?? null,
                atleta_a_id: data.atleta_a_id,
                atleta_b_id: null,
                vencedor_id: data.atleta_a_id,
                status: data.status ?? 'W_O',
                data_hora_prevista: data.data_hora_prevista ?? null,
                data_hora_inicio: data.data_hora_inicio ?? null,
                data_hora_fim: data.data_hora_fim ?? null,
                observacoes: composeObservacoes(data.observacoes, [data.atleta_a_id])
            };

            return JogoDAO.create(payload);
        }

        await this.validateReferences(data);
        return JogoDAO.create(data);
    }

    async update(id, data) {
        const current = await this.getById(id);
        const merged = {
            competicao_id: data.competicao_id ?? current.competicao_id,
            atleta_a_id: data.atleta_a_id ?? current.atleta_a_id,
            atleta_b_id: data.atleta_b_id ?? current.atleta_b_id,
            vencedor_id: data.vencedor_id !== undefined ? data.vencedor_id : current.vencedor_id
        };

        await this.validateReferences(merged);
        return JogoDAO.update(id, data);
    }

    async delete(id) {
        const deleted = await JogoDAO.delete(id);
        if (!deleted) {
            throw httpError('Jogo nao encontrado', 404);
        }
        return true;
    }

    async registrarResultadoJogo(payload) {
        const jogoId = Number(payload.jogoId || payload.jogo_id);
        const setsPayload = Array.isArray(payload.sets) ? payload.sets : [];

        if (!jogoId || !setsPayload.length) {
            throw httpError('jogoId e sets sao obrigatorios', 400);
        }

        if (setsPayload.length > 5) {
            throw httpError('Jogo melhor de 5 permite no maximo 5 sets', 400);
        }

        const jogo = await this.getById(jogoId);
        if (jogo.status === 'FINALIZADO') {
            throw httpError('Este jogo ja foi finalizado', 409);
        }

        let setsA = 0;
        let setsB = 0;

        const normalizedSets = setsPayload.map((set, index) => {
            const pontosA = Number(set.pontos_a ?? set.pontos_atleta_a);
            const pontosB = Number(set.pontos_b ?? set.pontos_atleta_b);

            if (Number.isNaN(pontosA) || Number.isNaN(pontosB)) {
                throw httpError('Pontos dos sets devem ser numericos', 400);
            }

            if (pontosA === pontosB) {
                throw httpError('Sets empatados nao sao permitidos', 400);
            }

            let vencedorSetId = null;
            if (pontosA > pontosB) {
                setsA += 1;
                vencedorSetId = jogo.atleta_a_id;
            } else if (pontosB > pontosA) {
                setsB += 1;
                vencedorSetId = jogo.atleta_b_id;
            }

            return {
                numero_set: Number(set.numero_set || index + 1),
                pontos_atleta_a: pontosA,
                pontos_atleta_b: pontosB,
                vencedor_set_id: vencedorSetId
            };
        });

        if (Math.max(setsA, setsB) !== 3 || normalizedSets.length < 3) {
            throw httpError('Resultado invalido para melhor de 5: vencedor precisa ganhar 3 sets', 400);
        }

        let vencedorId = payload.vencedor_id ? Number(payload.vencedor_id) : null;
        if (!vencedorId) {
            vencedorId = setsA > setsB ? jogo.atleta_a_id : setsB > setsA ? jogo.atleta_b_id : null;
        }

        if (!vencedorId) {
            throw httpError('Nao foi possivel determinar vencedor do jogo', 400);
        }

        await SetJogoDAO.replaceSetsForJogo(jogoId, normalizedSets);
        const updated = await JogoDAO.update(jogoId, {
            vencedor_id: vencedorId,
            status: 'FINALIZADO'
        });

        if (!normalizePhase(jogo.fase).startsWith('GRUPO_')) {
            await this._advanceKnockoutIfNeeded(jogo);
        }

        return {
            ...updated,
            sets: await SetJogoDAO.findAllByJogoId(jogoId)
        };
    }

    async atualizarResultadoJogo(payload) {
        const jogoId = Number(payload.jogoId || payload.jogo_id);
        const setsPayload = Array.isArray(payload.sets) ? payload.sets : [];

        if (!jogoId || !setsPayload.length) {
            throw httpError('jogoId e sets sao obrigatorios', 400);
        }

        if (setsPayload.length > 5) {
            throw httpError('Jogo melhor de 5 permite no maximo 5 sets', 400);
        }

        const jogo = await this.getById(jogoId);

        let setsA = 0;
        let setsB = 0;

        const normalizedSets = setsPayload.map((set, index) => {
            const pontosA = Number(set.pontos_a ?? set.pontos_atleta_a);
            const pontosB = Number(set.pontos_b ?? set.pontos_atleta_b);

            if (Number.isNaN(pontosA) || Number.isNaN(pontosB)) {
                throw httpError('Pontos dos sets devem ser numericos', 400);
            }

            if (pontosA === pontosB) {
                throw httpError('Sets empatados nao sao permitidos', 400);
            }

            let vencedorSetId = null;
            if (pontosA > pontosB) {
                setsA += 1;
                vencedorSetId = jogo.atleta_a_id;
            } else if (pontosB > pontosA) {
                setsB += 1;
                vencedorSetId = jogo.atleta_b_id;
            }

            return {
                numero_set: Number(set.numero_set || index + 1),
                pontos_atleta_a: pontosA,
                pontos_atleta_b: pontosB,
                vencedor_set_id: vencedorSetId
            };
        });

        if (Math.max(setsA, setsB) !== 3 || normalizedSets.length < 3) {
            throw httpError('Resultado invalido para melhor de 5: vencedor precisa ganhar 3 sets', 400);
        }

        let vencedorId = payload.vencedor_id ? Number(payload.vencedor_id) : null;
        if (!vencedorId) {
            vencedorId = setsA > setsB ? jogo.atleta_a_id : setsB > setsA ? jogo.atleta_b_id : null;
        }

        if (!vencedorId) {
            throw httpError('Nao foi possivel determinar vencedor do jogo', 400);
        }

        await SetJogoDAO.replaceSetsForJogo(jogoId, normalizedSets);
        const updated = await JogoDAO.update(jogoId, {
            vencedor_id: vencedorId,
            status: 'FINALIZADO'
        });

        if (!normalizePhase(jogo.fase).startsWith('GRUPO_')) {
            await this._advanceKnockoutIfNeeded(jogo);
        }

        return {
            ...updated,
            sets: await SetJogoDAO.findAllByJogoId(jogoId)
        };
    }
}

module.exports = new JogoService();
