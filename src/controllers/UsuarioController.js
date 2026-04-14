const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    async getAll(req, res, next) {
        try {
            const usuarios = await UsuarioService.getAll();
            res.status(200).json({
                success: true,
                count: usuarios.length,
                data: usuarios.map((u) => u.toJSON())
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const usuario = await UsuarioService.getById(req.params.id);
            res.status(200).json({ success: true, data: usuario.toJSON() });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const usuario = await UsuarioService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Usuario criado com sucesso',
                data: usuario.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const usuario = await UsuarioService.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Usuario atualizado com sucesso',
                data: usuario.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await UsuarioService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Usuario removido com sucesso' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UsuarioController();

