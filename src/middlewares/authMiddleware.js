const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token nao fornecido'
            });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({
                success: false,
                message: 'Formato de token invalido'
            });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({
                success: false,
                message: 'Token mal formatado'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token invalido ou expirado'
                });
            }

            req.userId = decoded.id;
            req.userEmail = decoded.email;
            req.userRole = decoded.papel;

            next();
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Falha na autenticacao'
        });
    }
};

module.exports = authMiddleware;
