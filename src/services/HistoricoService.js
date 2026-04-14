const HistoricoDAO = require('../dao/HistoricoDAO');
const httpError = require('../utils/httpError');

class HistoricoService {
    async getHistoricoResultados(jogoId) {
        return HistoricoDAO.findResultados(jogoId);
    }

    async getResultadoById(id) {
        const item = await HistoricoDAO.findResultadoById(id);
        if (!item) throw httpError('Historico de resultado nao encontrado', 404);
        return item;
    }

    async createResultado(data) {
        return HistoricoDAO.createResultado(data);
    }

    async updateResultado(id, data) {
        await this.getResultadoById(id);
        return HistoricoDAO.updateResultado(id, data);
    }

    async deleteResultado(id) {
        const deleted = await HistoricoDAO.deleteResultado(id);
        if (!deleted) throw httpError('Historico de resultado nao encontrado', 404);
        return true;
    }

    async getHistoricoRating(atletaId) {
        return HistoricoDAO.findRating(atletaId);
    }

    async getRatingById(id) {
        const item = await HistoricoDAO.findRatingById(id);
        if (!item) throw httpError('Historico de rating nao encontrado', 404);
        return item;
    }

    async createRating(data) {
        return HistoricoDAO.createRating(data);
    }

    async updateRating(id, data) {
        await this.getRatingById(id);
        return HistoricoDAO.updateRating(id, data);
    }

    async deleteRating(id) {
        const deleted = await HistoricoDAO.deleteRating(id);
        if (!deleted) throw httpError('Historico de rating nao encontrado', 404);
        return true;
    }
}

module.exports = new HistoricoService();
