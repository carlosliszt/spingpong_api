const CompeticaoService = require('../services/CompeticaoService');

class CompeticaoController {
    async getAll(req, res, next) {
        try {
            const competicoes = await CompeticaoService.getAll();
            res.status(200).json({ success: true, count: competicoes.length, data: competicoes });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const competicao = await CompeticaoService.getById(req.params.id);
            res.status(200).json({ success: true, data: competicao });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const competicao = await CompeticaoService.create(req.body, req.userId);
            res.status(201).json({ success: true, message: 'Competicao criada com sucesso', data: competicao });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const competicao = await CompeticaoService.update(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Competicao atualizada com sucesso', data: competicao });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await CompeticaoService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Competicao removida com sucesso' });
        } catch (error) {
            next(error);
        }
    }

    async gerarGruposBalanceados(req, res, next) {
        try {
            const data = await CompeticaoService.gerarGruposBalanceados(req.body);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async gerarJogosGrupo(req, res, next) {
        try {
            const data = await CompeticaoService.gerarJogosGrupo(req.body);
            res.status(201).json({ success: true, message: 'Jogos de grupo gerados com sucesso', data });
        } catch (error) {
            next(error);
        }
    }

    async finalizarGrupos(req, res, next) {
        try {
            const data = await CompeticaoService.finalizarGrupos(req.body);
            res.status(200).json({ success: true, message: 'Grupos finalizados', data });
        } catch (error) {
            next(error);
        }
    }

    async gerarMataMata(req, res, next) {
        try {
            const data = await CompeticaoService.gerarMataMata(req.body);
            res.status(201).json({ success: true, message: 'Mata-mata gerado com sucesso', data });
        } catch (error) {
            next(error);
        }
    }

    async getClassificacaoGrupo(req, res, next) {
        try {
            const data = await CompeticaoService.getClassificacaoGrupo(Number(req.params.id), req.params.groupId);
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    }

    async getBracket(req, res, next) {
        try {
            const data = await CompeticaoService.getBracket(Number(req.params.id));
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CompeticaoController();
