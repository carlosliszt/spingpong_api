const { body } = require('express-validator');

const registerValidator = [
    body('nome')
        .notEmpty().withMessage('Nome e obrigatorio')
        .isLength({ min: 3, max: 120 }).withMessage('Nome deve ter entre 3 e 120 caracteres'),

    body('email')
        .notEmpty().withMessage('Email e obrigatorio')
        .isEmail().withMessage('Email invalido')
        .normalizeEmail(),

    body('senha')
        .notEmpty().withMessage('Senha e obrigatoria')
        .isLength({ min: 6 }).withMessage('Senha deve ter no minimo 6 caracteres')
];

const loginValidator = [
    body('email')
        .notEmpty().withMessage('Email e obrigatorio')
        .isEmail().withMessage('Email invalido')
        .normalizeEmail(),

    body('senha')
        .notEmpty().withMessage('Senha e obrigatoria')
];

module.exports = {
    registerValidator,
    loginValidator
};
