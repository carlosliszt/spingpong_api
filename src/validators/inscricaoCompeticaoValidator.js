const { body } = require('express-validator');

const STATUS = ['INSCRITO', 'CONFIRMADO', 'CANCELADO'];

const inscricaoCompeticaoValidator = [
    body('competicao_id')
        .notEmpty().withMessage('Competicao e obrigatoria')
        .isInt({ min: 1 }).withMessage('competicao_id invalido'),

    body('atleta_id')
        .notEmpty().withMessage('Atleta e obrigatorio')
        .isInt({ min: 1 }).withMessage('atleta_id invalido'),

    body('seed_num')
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('seed_num deve ser inteiro positivo'),

    body('status')
        .optional()
        .isIn(STATUS).withMessage('Status invalido')
];

module.exports = inscricaoCompeticaoValidator;

