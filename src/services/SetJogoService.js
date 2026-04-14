const SetJogoDAO = require('../dao/SetJogoDAO');
const JogoDAO = require('../dao/JogoDAO');
const httpError = require('../utils/httpError');

class SetJogoService {
    async getByJogoId(jogoId) {
        return SetJogoDAO.findAllByJogoId(jogoId);
    }

    async getById(id) {
        const set = await SetJogoDAO.findById(id);
        if (!set) {
            throw httpError('Set nao encontrado', 404);
        }
        return set;
    }

    async validateSetPayload(data) {
        const jogo = await JogoDAO.findById(data.jogo_id);
        if (!jogo) {
            throw httpError('Jogo nao encontrado', 404);
        }

        const duplicated = await SetJogoDAO.findByJogoAndNumeroSet(data.jogo_id, data.numero_set);
        if (duplicated) {
            throw httpError('Numero de set ja utilizado neste jogo', 409);
        }

        if (data.vencedor_set_id !== undefined && data.vencedor_set_id !== null) {
            if (data.vencedor_set_id !== jogo.atleta_a_id && data.vencedor_set_id !== jogo.atleta_b_id) {
                throw httpError('Vencedor do set precisa ser atleta A ou B do jogo', 400);
            }
        }
    }

    async create(data) {
        await this.validateSetPayload(data);
        return SetJogoDAO.create(data);
    }

    async update(id, data) {
        const current = await this.getById(id);
        const jogo = await JogoDAO.findById(current.jogo_id);

        if (data.numero_set !== undefined && data.numero_set !== current.numero_set) {
            const duplicated = await SetJogoDAO.findByJogoAndNumeroSet(current.jogo_id, data.numero_set);
            if (duplicated) {
                throw httpError('Numero de set ja utilizado neste jogo', 409);
            }
        }

        if (data.vencedor_set_id !== undefined && data.vencedor_set_id !== null) {
            if (data.vencedor_set_id !== jogo.atleta_a_id && data.vencedor_set_id !== jogo.atleta_b_id) {
                throw httpError('Vencedor do set precisa ser atleta A ou B do jogo', 400);
            }
        }

        return SetJogoDAO.update(id, data);
    }

    async delete(id) {
        const deleted = await SetJogoDAO.delete(id);
        if (!deleted) {
            throw httpError('Set nao encontrado', 404);
        }
        return true;
    }
}

module.exports = new SetJogoService();

