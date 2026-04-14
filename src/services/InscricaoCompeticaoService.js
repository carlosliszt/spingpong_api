const InscricaoCompeticaoDAO = require('../dao/InscricaoCompeticaoDAO');
const CompeticaoDAO = require('../dao/CompeticaoDAO');
const AtletaDAO = require('../dao/AtletaDAO');
const httpError = require('../utils/httpError');

class InscricaoCompeticaoService {
    async getAll() {
        return InscricaoCompeticaoDAO.findAll();
    }

    async getById(id) {
        const inscricao = await InscricaoCompeticaoDAO.findById(id);
        if (!inscricao) {
            throw httpError('Inscricao nao encontrada', 404);
        }
        return inscricao;
    }

    async create(data) {
        const competicao = await CompeticaoDAO.findById(data.competicao_id);
        if (!competicao) {
            throw httpError('Competicao nao encontrada', 404);
        }

        const hoje = new Date().toISOString().slice(0, 10);
        const dataInicio = new Date(competicao.data_inicio).toISOString().slice(0, 10);
        if (hoje > dataInicio) {
            throw httpError('Inscricoes encerradas para esta competicao', 400);
        }

        const atleta = await AtletaDAO.findById(data.atleta_id);
        if (!atleta) {
            throw httpError('Atleta nao encontrado', 404);
        }

        const existing = await InscricaoCompeticaoDAO.findByCompeticaoAndAtleta(data.competicao_id, data.atleta_id);
        if (existing) {
            throw httpError('Atleta ja inscrito nesta competicao', 409);
        }

        return InscricaoCompeticaoDAO.create(data);
    }

    async update(id, data) {
        await this.getById(id);
        return InscricaoCompeticaoDAO.update(id, data);
    }

    async delete(id) {
        const deleted = await InscricaoCompeticaoDAO.delete(id);
        if (!deleted) {
            throw httpError('Inscricao nao encontrada', 404);
        }
        return true;
    }
}

module.exports = new InscricaoCompeticaoService();

