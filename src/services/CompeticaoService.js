const CompeticaoDAO = require('../dao/CompeticaoDAO');
const UsuarioDAO = require('../dao/UsuarioDAO');
const InscricaoCompeticaoDAO = require('../dao/InscricaoCompeticaoDAO');
const AtletaDAO = require('../dao/AtletaDAO');
const JogoDAO = require('../dao/JogoDAO');
const SetJogoDAO = require('../dao/SetJogoDAO');
const httpError = require('../utils/httpError');

function toGroupCode(index) {
    return String(index + 1).padStart(2, '0');
}

function snakeIndexes(groupsCount, totalSlots) {
    const forward = Array.from({ length: groupsCount }, (_, i) => i);
    const backward = [...forward].reverse();
    const cycle = [...forward, ...backward];
    const result = [];

    while (result.length < totalSlots) {
        for (const index of cycle) {
            if (result.length >= totalSlots) break;
            result.push(index);
        }
    }

    return result;
}

function roundRobinPairs(playerIds) {
    const pairs = [];
    for (let i = 0; i < playerIds.length; i += 1) {
        for (let j = i + 1; j < playerIds.length; j += 1) {
            pairs.push([playerIds[i], playerIds[j]]);
        }
    }
    return pairs;
}

function extremePairs(playerIds) {
    const pairs = [];
    let left = 0;
    let right = playerIds.length - 1;

    while (left < right) {
        pairs.push([playerIds[left], playerIds[right]]);
        left += 1;
        right -= 1;
    }

    return pairs;
}

function roundNameByBracketSize(size) {
    if (size <= 2) return 'FINAL';
    if (size <= 4) return 'SEMI_FINAL';
    if (size <= 8) return 'QUARTAS_FINAL';
    if (size <= 16) return 'OITAVAS_FINAL';
    return `MATA_${size}`;
}

class CompeticaoService {
    async getAll() {
        return CompeticaoDAO.findAll();
    }

    async getById(id) {
        const competicao = await CompeticaoDAO.findById(id);
        if (!competicao) {
            throw httpError('Competicao nao encontrada', 404);
        }
        return competicao;
    }

    async create(data, userId) {
        const admin = await UsuarioDAO.findById(userId);
        if (!admin) {
            throw httpError('Usuario autenticado nao encontrado', 401);
        }

        const existing = await CompeticaoDAO.findByNomeAndDataInicio(data.nome, data.data_inicio);
        if (existing) {
            throw httpError('Ja existe competicao com mesmo nome e data de inicio', 409);
        }

        return CompeticaoDAO.create({ ...data, created_by: userId });
    }

    async update(id, data) {
        await this.getById(id);
        return CompeticaoDAO.update(id, data);
    }

    async delete(id) {
        const deleted = await CompeticaoDAO.delete(id);
        if (!deleted) {
            throw httpError('Competicao nao encontrada', 404);
        }
        return true;
    }

    async _resolveParticipants(competition, athleteIds = []) {
        let athletes = [];

        if (athleteIds.length) {
            athletes = await AtletaDAO.findManyByIds(athleteIds);
            if (athletes.length !== athleteIds.length) {
                throw httpError('Um ou mais atletas informados nao existem', 404);
            }

            for (const athlete of athletes) {
                await InscricaoCompeticaoDAO.createIfNotExists({
                    competicao_id: competition.id,
                    atleta_id: athlete.id
                });
            }
        } else {
            const inscricoes = await InscricaoCompeticaoDAO.findByCompeticaoId(competition.id);
            athletes = inscricoes.map((row) => ({
                id: row.atleta_id,
                nome: row.atleta_nome,
                rating_atual: Number(row.rating_atual),
                ranking_posicao: row.ranking_posicao
            }));
        }

        if (!athletes.length) {
            throw httpError('Nao ha atletas inscritos para a competicao', 400);
        }

        return [...athletes].sort((a, b) => Number(b.rating_atual) - Number(a.rating_atual));
    }

    async gerarGruposBalanceados(payload) {
        const competitionId = Number(payload.competitionId || payload.competicao_id);
        const athleteIds = Array.isArray(payload.athleteIds) ? payload.athleteIds.map(Number) : [];
        const competition = await this.getById(competitionId);
        const athletes = await this._resolveParticipants(competition, athleteIds);

        const maxByGroup = competition.tipo === 'SPING_OPEN' ? 5 : 4;
        const groupsCount = Math.max(1, Math.ceil(athletes.length / maxByGroup));
        const groups = Array.from({ length: groupsCount }, (_, i) => ({
            id: `G${toGroupCode(i)}`,
            nome: `Grupo ${toGroupCode(i)}`,
            ordem: i + 1,
            atletas: []
        }));

        const indexes = snakeIndexes(groupsCount, athletes.length);
        athletes.forEach((athlete, i) => {
            groups[indexes[i]].atletas.push(athlete);
        });

        return {
            competicao_id: competitionId,
            grupos: groups
        };
    }

    async gerarJogosGrupo(payload) {
        const competitionId = Number(payload.competitionId || payload.competicao_id);
        const generatedGroups = await this.gerarGruposBalanceados({ competitionId });

        const existingGroupMatches = (await JogoDAO.findByCompeticao(competitionId)).filter((j) =>
            String(j.fase).startsWith('GRUPO_')
        );

        if (existingGroupMatches.length) {
            throw httpError('Jogos de grupo ja foram gerados para esta competicao', 409);
        }

        const matchesToCreate = [];

        generatedGroups.grupos.forEach((group) => {
            const orderedAthletes = [...group.atletas].sort((a, b) => Number(b.rating_atual) - Number(a.rating_atual));
            const athleteIds = orderedAthletes.map((a) => a.id);

            const allPairs = roundRobinPairs(athleteIds);
            const firstRoundPairs = extremePairs(athleteIds);
            const firstRoundSet = new Set(
                firstRoundPairs.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`)
            );

            const remainingPairs = allPairs.filter(([a, b]) => {
                const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
                return !firstRoundSet.has(key);
            });

            const orderedPairs = [...firstRoundPairs, ...remainingPairs];

            orderedPairs.forEach(([atletaA, atletaB], index) => {
                matchesToCreate.push({
                    competicao_id: competitionId,
                    fase: `GRUPO_${group.id}`,
                    rodada: index + 1,
                    atleta_a_id: atletaA,
                    atleta_b_id: atletaB,
                    status: 'AGENDADO'
                });
            });
        });

        const created = await JogoDAO.createMany(matchesToCreate);
        await CompeticaoDAO.update(competitionId, { status: 'EM_ANDAMENTO' });

        return {
            competicao_id: competitionId,
            grupos: generatedGroups.grupos,
            jogos: created
        };
    }

    async _classificacaoPorFaseGrupo(competitionId, fase) {
        const matches = await JogoDAO.findByCompeticaoAndFase(competitionId, fase);
        const standings = new Map();

        const ensureAthlete = (id) => {
            if (!standings.has(id)) {
                standings.set(id, {
                    grupo_id: fase.replace('GRUPO_', ''),
                    atleta_id: id,
                    vitorias: 0,
                    derrotas: 0,
                    saldo_sets: 0,
                    saldo_pontos: 0
                });
            }
            return standings.get(id);
        };

        for (const match of matches) {
            const athleteA = ensureAthlete(match.atleta_a_id);
            const athleteB = ensureAthlete(match.atleta_b_id);

            if (match.status !== 'FINALIZADO' && match.status !== 'W_O') {
                continue;
            }

            if (match.vencedor_id === match.atleta_a_id) {
                athleteA.vitorias += 1;
                athleteB.derrotas += 1;
            } else if (match.vencedor_id === match.atleta_b_id) {
                athleteB.vitorias += 1;
                athleteA.derrotas += 1;
            }

            const sets = await SetJogoDAO.findAllByJogoId(match.id);
            if (!sets.length) continue;

            for (const set of sets) {
                athleteA.saldo_pontos += set.pontos_atleta_a - set.pontos_atleta_b;
                athleteB.saldo_pontos += set.pontos_atleta_b - set.pontos_atleta_a;

                if (set.pontos_atleta_a > set.pontos_atleta_b) {
                    athleteA.saldo_sets += 1;
                    athleteB.saldo_sets -= 1;
                } else if (set.pontos_atleta_b > set.pontos_atleta_a) {
                    athleteB.saldo_sets += 1;
                    athleteA.saldo_sets -= 1;
                }
            }
        }

        const athletes = await AtletaDAO.findManyByIds([...standings.keys()]);
        const athleteById = new Map(athletes.map((a) => [a.id, a]));

        return [...standings.values()]
            .map((row) => ({ ...row, nome_atleta: athleteById.get(row.atleta_id)?.nome || `Atleta ${row.atleta_id}` }))
            .sort((a, b) => {
                if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
                if (b.saldo_sets !== a.saldo_sets) return b.saldo_sets - a.saldo_sets;
                return b.saldo_pontos - a.saldo_pontos;
            });
    }

    async getClassificacaoGrupo(competitionId, groupId) {
        await this.getById(competitionId);
        const fase = groupId.startsWith('GRUPO_') ? groupId : `GRUPO_${groupId}`;
        const standings = await this._classificacaoPorFaseGrupo(competitionId, fase);
        return standings.map((row, index) => ({ ...row, posicao: index + 1 }));
    }

    async finalizarGrupos(payload) {
        const competitionId = Number(payload.competitionId || payload.competicao_id);
        await this.getById(competitionId);

        const fasesGrupo = await JogoDAO.findDistinctGroupFases(competitionId);
        if (!fasesGrupo.length) {
            throw httpError('Nao existem jogos de grupo para finalizar', 400);
        }

        const standingsByGroup = {};

        for (const fase of fasesGrupo) {
            const matches = await JogoDAO.findByCompeticaoAndFase(competitionId, fase);
            const allFinished = matches.every((m) => m.status === 'FINALIZADO' || m.status === 'W_O');
            if (!allFinished) {
                throw httpError(`Ainda existem jogos pendentes em ${fase}`, 400);
            }

            standingsByGroup[fase.replace('GRUPO_', '')] = await this._classificacaoPorFaseGrupo(competitionId, fase);
        }

        return {
            competicao_id: competitionId,
            standingsByGroup
        };
    }

    _seedsSnake(entries) {
        const sorted = [...entries];
        const result = [];
        let left = 0;
        let right = sorted.length - 1;

        while (left <= right) {
            if (left === right) {
                result.push(sorted[left]);
                break;
            }
            result.push(sorted[left], sorted[right]);
            left += 1;
            right -= 1;
        }

        return result;
    }

    async gerarMataMata(payload) {
        const competitionId = Number(payload.competitionId || payload.competicao_id);
        const competition = await this.getById(competitionId);

        const existing = await JogoDAO.findEliminatoriasByCompeticao(competitionId);
        if (existing.length) {
            throw httpError('Mata-mata ja foi gerado para esta competicao', 409);
        }

        const groupFinal = await this.finalizarGrupos({ competitionId });
        const standingsByGroup = groupFinal.standingsByGroup;
        const athletesById = new Map((await AtletaDAO.findAll()).map((a) => [a.id, a]));

        const phasesToCreate = [];

        if (competition.tipo === 'SPING_OPEN') {
            const levels = { A: [], B: [], C: [], D: [] };

            Object.values(standingsByGroup).forEach((standing) => {
                if (standing[0]) levels.A.push(standing[0].atleta_id);
                if (standing[1]) levels.A.push(standing[1].atleta_id);
                if (standing[2]) levels.B.push(standing[2].atleta_id);
                if (standing[3]) levels.C.push(standing[3].atleta_id);
                if (standing[4]) levels.D.push(standing[4].atleta_id);
            });

            for (const [level, athleteIds] of Object.entries(levels)) {
                if (!athleteIds.length) continue;

                const seeded = this._seedsSnake(
                    athleteIds
                        .map((id) => athletesById.get(id))
                        .filter(Boolean)
                        .sort((a, b) => Number(b.rating_atual) - Number(a.rating_atual))
                );

                const phaseName = `OPEN_${level}_${roundNameByBracketSize(seeded.length)}`;
                for (let i = 0; i < seeded.length; i += 2) {
                    if (!seeded[i + 1]) continue; // bye automatico
                    phasesToCreate.push({
                        competicao_id: competitionId,
                        fase: phaseName,
                        rodada: i / 2 + 1,
                        atleta_a_id: seeded[i].id,
                        atleta_b_id: seeded[i + 1].id,
                        status: 'AGENDADO',
                        observacoes: `NIVEL_${level}`
                    });
                }
            }
        } else {
            const classificados = [];
            Object.values(standingsByGroup).forEach((standing) => {
                if (standing[0]) classificados.push(standing[0].atleta_id);
                if (standing[1]) classificados.push(standing[1].atleta_id);
            });

            const seeded = this._seedsSnake(
                classificados
                    .map((id) => athletesById.get(id))
                    .filter(Boolean)
                    .sort((a, b) => Number(b.rating_atual) - Number(a.rating_atual))
            );

            const phaseName = roundNameByBracketSize(seeded.length);
            for (let i = 0; i < seeded.length; i += 2) {
                if (!seeded[i + 1]) continue; // bye automatico
                phasesToCreate.push({
                    competicao_id: competitionId,
                    fase: phaseName,
                    rodada: i / 2 + 1,
                    atleta_a_id: seeded[i].id,
                    atleta_b_id: seeded[i + 1].id,
                    status: 'AGENDADO'
                });
            }
        }

        const created = await JogoDAO.createMany(phasesToCreate);
        return {
            competicao_id: competitionId,
            jogos: created
        };
    }

    async getBracket(competitionId) {
        await this.getById(competitionId);
        const matches = await JogoDAO.findEliminatoriasByCompeticao(competitionId);

        return matches.map((match, index) => ({
            id: String(match.id),
            round: match.fase,
            slot: match.rodada || index + 1,
            atleta_a_id: match.atleta_a_id,
            atleta_a_nome: match.atleta_a_nome,
            atleta_b_id: match.atleta_b_id,
            atleta_b_nome: match.atleta_b_nome,
            vencedor_id: match.vencedor_id,
            vencedor_nome: match.vencedor_nome,
            status: match.status,
            observacoes: match.observacoes
        }));
    }
}

module.exports = new CompeticaoService();

