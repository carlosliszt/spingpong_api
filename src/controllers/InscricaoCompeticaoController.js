const InscricaoCompeticaoService = require('../services/InscricaoCompeticaoService');

class InscricaoCompeticaoController {
    async getAll(req, res, next) {
        try {
            const inscricoes = await InscricaoCompeticaoService.getAll();
            res.status(200).json({ success: true, count: inscricoes.length, data: inscricoes });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const inscricao = await InscricaoCompeticaoService.getById(req.params.id);
            res.status(200).json({ success: true, data: inscricao });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const inscricao = await InscricaoCompeticaoService.create(req.body);
            res.status(201).json({ success: true, message: 'Inscricao criada com sucesso', data: inscricao });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const inscricao = await InscricaoCompeticaoService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Inscricao atualizada com sucesso', data: inscricao });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await InscricaoCompeticaoService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Inscricao removida com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new InscricaoCompeticaoController();

