const { body } = require('express-validator');

const atletaValidator = [
    body('nome')
        .notEmpty().withMessage('Nome e obrigatorio')
        .isLength({ max: 120 }).withMessage('Nome deve ter no maximo 120 caracteres'),

    body('data_nascimento')
        .optional({ nullable: true })
        .isISO8601().withMessage('Data de nascimento invalida (use YYYY-MM-DD)'),

    body('sexo')
        .optional({ nullable: true })
        .isLength({ max: 20 }).withMessage('Sexo deve ter no maximo 20 caracteres'),

    body('email')
        .optional({ nullable: true })
        .isEmail().withMessage('Email invalido')
        .normalizeEmail(),

    body('telefone')
        .optional({ nullable: true })
        .isLength({ max: 30 }).withMessage('Telefone deve ter no maximo 30 caracteres'),

    body('ativo')
        .optional()
        .isInt({ min: 0, max: 1 }).withMessage('Ativo deve ser 0 ou 1'),

    body('rating_atual')
        .optional()
        .isFloat({ min: 0 }).withMessage('Rating atual deve ser um numero maior ou igual a 0'),

    body('ranking_posicao')
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage('Ranking posicao deve ser um inteiro positivo')
];

module.exports = atletaValidator;

