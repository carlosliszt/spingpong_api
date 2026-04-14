const AtletaService = require('../services/AtletaService');

class AtletaController {
    async getAll(req, res, next) {
        try {
            const atletas = await AtletaService.getAll();
            res.status(200).json({ success: true, count: atletas.length, data: atletas });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const atleta = await AtletaService.getById(req.params.id);
            res.status(200).json({ success: true, data: atleta });
        } catch (error) {
            next(error);
        }
    }

    async getRanking(req, res, next) {
        try {
            const ranking = await AtletaService.rankingAtual();
            res.status(200).json({ success: true, count: ranking.length, data: ranking });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const atleta = await AtletaService.create(req.body);
            res.status(201).json({ success: true, message: 'Atleta criado com sucesso', data: atleta });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const atleta = await AtletaService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Atleta atualizado com sucesso', data: atleta });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await AtletaService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Atleta removido com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AtletaController();

