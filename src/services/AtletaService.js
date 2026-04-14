const AtletaDAO = require('../dao/AtletaDAO');
const httpError = require('../utils/httpError');

class AtletaService {
    async getAll() {
        return AtletaDAO.findAll();
    }

    async getById(id) {
        const atleta = await AtletaDAO.findById(id);
        if (!atleta) {
            throw httpError('Atleta nao encontrado', 404);
        }
        return atleta;
    }

    async create(data) {
        const existingNome = await AtletaDAO.findByNome(data.nome);
        if (existingNome) {
            throw httpError('Ja existe um atleta com este nome', 409);
        }

        if (data.email) {
            const existingEmail = await AtletaDAO.findByEmail(data.email);
            if (existingEmail) {
                throw httpError('Email de atleta ja cadastrado', 409);
            }
        }

        return AtletaDAO.create(data);
    }

    async update(id, data) {
        const atleta = await this.getById(id);

        if (data.email && data.email !== atleta.email) {
            const existingEmail = await AtletaDAO.findByEmail(data.email);
            if (existingEmail) {
                throw httpError('Email de atleta ja cadastrado', 409);
            }
        }

        if (data.nome && data.nome !== atleta.nome) {
            const existingNome = await AtletaDAO.findByNome(data.nome);
            if (existingNome) {
                throw httpError('Ja existe um atleta com este nome', 409);
            }
        }

        return AtletaDAO.update(id, data);
    }

    async delete(id) {
        const deleted = await AtletaDAO.delete(id);
        if (!deleted) {
            throw httpError('Atleta nao encontrado', 404);
        }
        return true;
    }

    async rankingAtual() {
        return AtletaDAO.rankingAtual();
    }
}

module.exports = new AtletaService();

