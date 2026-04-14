const AuthService = require('../services/AuthService');

class AuthController {
    async register(req, res, next) {
        try {
            const { nome, email, senha } = req.body;
            const result = await AuthService.register(nome, email, senha);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado com sucesso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            const result = await AuthService.login(email, senha);

            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async me(req, res, next) {
        try {
            res.status(200).json({
                success: true,
                data: {
                    id: req.userId,
                    email: req.userEmail,
                    papel: req.userRole
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
