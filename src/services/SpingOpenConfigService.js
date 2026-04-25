const SpingOpenConfigDAO = require('../dao/SpingOpenConfigDAO');
const httpError = require('../utils/httpError');

class SpingOpenConfigService {
    async getAll() {
        return SpingOpenConfigDAO.findAll();
    }

    async getById(id) {
        const config = await SpingOpenConfigDAO.findById(id);
        if (!config) {
            throw httpError('Configuração SPING_OPEN não encontrada', 404);
        }
        return this._enrichConfig(config);
    }

    async getDefault() {
        let config = await SpingOpenConfigDAO.findDefault();
        if (!config) {
            config = await SpingOpenConfigDAO.findActive();
        }
        if (!config) {
            throw httpError('Nenhuma configuração SPING_OPEN disponível', 404);
        }
        return this._enrichConfig(config);
    }

    async getActive() {
        const config = await SpingOpenConfigDAO.findActive();
        if (!config) {
            throw httpError('Nenhuma configuração SPING_OPEN ativa disponível', 404);
        }
        return this._enrichConfig(config);
    }

    async create(data) {
        const { nome, descricao, atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d, ativo, padrao } = data;

        if (!nome || nome.trim().length === 0) {
            throw httpError('Nome da configuração é obrigatório', 400);
        }

        if (!atletas_por_grupo || atletas_por_grupo < 3 || atletas_por_grupo > 10) {
            throw httpError('Atletas por grupo deve estar entre 3 e 10', 400);
        }

        // Validar posições
        this._validatePositions(atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d);

        const config = await SpingOpenConfigDAO.create({
            nome,
            descricao,
            atletas_por_grupo,
            posicoes_nivel_a,
            posicoes_nivel_b,
            posicoes_nivel_c,
            posicoes_nivel_d,
            ativo: ativo !== false,
            padrao: !!padrao
        });

        return this._enrichConfig(config);
    }

    async update(id, data) {
        await this.getById(id); // Valida existência

        const { atletas_por_grupo, posicoes_nivel_a, posicoes_nivel_b, posicoes_nivel_c, posicoes_nivel_d } = data;

        // Se mudar quantidade de atletas, validar posições
        if (atletas_por_grupo || posicoes_nivel_a || posicoes_nivel_b || posicoes_nivel_c || posicoes_nivel_d) {
            const current = await SpingOpenConfigDAO.findById(id);
            const maxAtletas = atletas_por_grupo || current.atletas_por_grupo;
            const posA = posicoes_nivel_a || current.posicoes_nivel_a;
            const posB = posicoes_nivel_b || current.posicoes_nivel_b;
            const posC = posicoes_nivel_c || current.posicoes_nivel_c;
            const posD = posicoes_nivel_d || current.posicoes_nivel_d;

            this._validatePositions(maxAtletas, posA, posB, posC, posD);
        }

        const config = await SpingOpenConfigDAO.update(id, data);
        return this._enrichConfig(config);
    }

    async delete(id) {
        const deleted = await SpingOpenConfigDAO.delete(id);
        if (!deleted) {
            throw httpError('Configuração não encontrada', 404);
        }
        return true;
    }

    _validatePositions(maxAtletas, posA, posB, posC, posD) {
        const positionsA = SpingOpenConfigDAO.parsePositions(posA);
        const positionsB = SpingOpenConfigDAO.parsePositions(posB);
        const positionsC = SpingOpenConfigDAO.parsePositions(posC);
        const positionsD = SpingOpenConfigDAO.parsePositions(posD);

        const allPositions = [...new Set([...positionsA, ...positionsB, ...positionsC, ...positionsD])];

        // Verificar se não há sobreposição
        const combined = [
            ...positionsA.map((p) => ({ pos: p, level: 'A' })),
            ...positionsB.map((p) => ({ pos: p, level: 'B' })),
            ...positionsC.map((p) => ({ pos: p, level: 'C' })),
            ...positionsD.map((p) => ({ pos: p, level: 'D' }))
        ];

        const seen = new Set();
        for (const { pos } of combined) {
            if (seen.has(pos)) {
                throw httpError(`Posição ${pos} não pode estar em múltiplos níveis`, 400);
            }
            seen.add(pos);
        }

        // Verificar se todas as posições estão dentro do intervalo válido
        for (const pos of allPositions) {
            if (pos > maxAtletas) {
                throw httpError(`Posição ${pos} não pode ser maior que ${maxAtletas} atletas por grupo`, 400);
            }
        }
    }

    _enrichConfig(config) {
        return {
            ...config,
            posicoes_nivel_a: SpingOpenConfigDAO.parsePositions(config.posicoes_nivel_a),
            posicoes_nivel_b: SpingOpenConfigDAO.parsePositions(config.posicoes_nivel_b),
            posicoes_nivel_c: SpingOpenConfigDAO.parsePositions(config.posicoes_nivel_c),
            posicoes_nivel_d: SpingOpenConfigDAO.parsePositions(config.posicoes_nivel_d)
        };
    }
}

module.exports = new SpingOpenConfigService();

