const JogoService = require('../services/JogoService');

class JogoController {
    async getAll(req, res, next) {
        try {
            const jogos = await JogoService.getAll();
            res.status(200).json({ success: true, count: jogos.length, data: jogos });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const jogo = await JogoService.getById(req.params.id);
            res.status(200).json({ success: true, data: jogo });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const jogo = await JogoService.create(req.body);
            res.status(201).json({ success: true, message: 'Jogo criado com sucesso', data: jogo });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const jogo = await JogoService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Jogo atualizado com sucesso', data: jogo });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await JogoService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Jogo removido com sucesso' });
        } catch (error) {
            next(error);
        }
    }

    async registrarResultado(req, res, next) {
        try {
            const jogo = await JogoService.registrarResultadoJogo(req.body);
            res.status(200).json({ success: true, message: 'Resultado registrado com sucesso', data: jogo });
        } catch (error) {
            next(error);
        }
    }

    async atualizarResultado(req, res, next) {
        try {
            const jogo = await JogoService.atualizarResultadoJogo(req.body);
            res.status(200).json({ success: true, message: 'Resultado atualizado com sucesso', data: jogo });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JogoController();
