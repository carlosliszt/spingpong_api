const HistoricoService = require('../services/HistoricoService');

class HistoricoController {
    async resultados(req, res, next) {
        try {
            const data = await HistoricoService.getHistoricoResultados(req.query.jogo_id);
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    }

    async resultadoById(req, res, next) {
        try {
            const data = await HistoricoService.getResultadoById(req.params.id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async createResultado(req, res, next) {
        try {
            const data = await HistoricoService.createResultado(req.body);
            res.status(201).json({ success: true, message: 'Historico de resultado criado', data });
        } catch (error) {
            next(error);
        }
    }

    async updateResultado(req, res, next) {
        try {
            const data = await HistoricoService.updateResultado(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Historico de resultado atualizado', data });
        } catch (error) {
            next(error);
        }
    }

    async deleteResultado(req, res, next) {
        try {
            await HistoricoService.deleteResultado(req.params.id);
            res.status(200).json({ success: true, message: 'Historico de resultado removido' });
        } catch (error) {
            next(error);
        }
    }

    async rating(req, res, next) {
        try {
            const data = await HistoricoService.getHistoricoRating(req.query.atleta_id);
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    }

    async ratingById(req, res, next) {
        try {
            const data = await HistoricoService.getRatingById(req.params.id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async createRating(req, res, next) {
        try {
            const data = await HistoricoService.createRating(req.body);
            res.status(201).json({ success: true, message: 'Historico de rating criado', data });
        } catch (error) {
            next(error);
        }
    }

    async updateRating(req, res, next) {
        try {
            const data = await HistoricoService.updateRating(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Historico de rating atualizado', data });
        } catch (error) {
            next(error);
        }
    }

    async deleteRating(req, res, next) {
        try {
            await HistoricoService.deleteRating(req.params.id);
            res.status(200).json({ success: true, message: 'Historico de rating removido' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new HistoricoController();
