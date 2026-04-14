const SetJogoService = require('../services/SetJogoService');

class SetJogoController {
    async getByJogo(req, res, next) {
        try {
            const sets = await SetJogoService.getByJogoId(req.params.jogoId);
            res.status(200).json({ success: true, count: sets.length, data: sets });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const set = await SetJogoService.create(req.body);
            res.status(201).json({ success: true, message: 'Set criado com sucesso', data: set });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const set = await SetJogoService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Set atualizado com sucesso', data: set });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await SetJogoService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Set removido com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SetJogoController();

