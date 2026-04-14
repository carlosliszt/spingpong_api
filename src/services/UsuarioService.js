const bcrypt = require('bcryptjs');
const UsuarioDAO = require('../dao/UsuarioDAO');
const httpError = require('../utils/httpError');

class UsuarioService {
    async getAll() {
        return UsuarioDAO.findAll();
    }

    async getById(id) {
        const usuario = await UsuarioDAO.findById(id);
        if (!usuario) {
            throw httpError('Usuario nao encontrado', 404);
        }
        return usuario;
    }

    async create(data) {
        const existingEmail = await UsuarioDAO.findByEmail(data.email);
        if (existingEmail) {
            throw httpError('Email ja cadastrado', 409);
        }

        const senha_hash = await bcrypt.hash(data.senha, 10);
        return UsuarioDAO.create({
            nome: data.nome,
            email: data.email,
            senha_hash,
            papel: data.papel,
            ativo: data.ativo
        });
    }

    async update(id, data) {
        const usuario = await this.getById(id);

        if (data.email && data.email !== usuario.email) {
            const existingEmail = await UsuarioDAO.findByEmail(data.email);
            if (existingEmail) {
                throw httpError('Email ja cadastrado', 409);
            }
        }

        const payload = {
            nome: data.nome,
            email: data.email,
            papel: data.papel,
            ativo: data.ativo
        };

        if (data.senha) {
            payload.senha_hash = await bcrypt.hash(data.senha, 10);
        }

        return UsuarioDAO.update(id, payload);
    }

    async delete(id) {
        const deleted = await UsuarioDAO.delete(id);
        if (!deleted) {
            throw httpError('Usuario nao encontrado', 404);
        }
        return true;
    }
}

module.exports = new UsuarioService();

