const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioDAO = require('../dao/UsuarioDAO');
const httpError = require('../utils/httpError');

class AuthService {
    async register(nome, email, senha) {
        const existingEmail = await UsuarioDAO.findByEmail(email);
        if (existingEmail) {
            throw httpError('Email ja cadastrado', 409);
        }

        const senha_hash = await bcrypt.hash(senha, 10);
        const usuario = await UsuarioDAO.create({ nome, email, senha_hash });
        const token = this.generateToken(usuario);

        return { usuario: usuario.toJSON(), token };
    }

    async login(email, senha) {
        const usuario = await UsuarioDAO.findByEmail(email);
        if (!usuario) {
            throw httpError('Credenciais invalidas', 401);
        }

        const isPasswordValid = await bcrypt.compare(senha, usuario.senha_hash);
        if (!isPasswordValid) {
            throw httpError('Credenciais invalidas', 401);
        }

        const token = this.generateToken(usuario);
        return { usuario: usuario.toJSON(), token };
    }

    generateToken(usuario) {
        return jwt.sign(
            { id: usuario.id, email: usuario.email, papel: usuario.papel },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
        );
    }
}

module.exports = new AuthService();
