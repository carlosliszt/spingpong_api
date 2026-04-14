const { body } = require('express-validator');

const TIPOS = ['SPING_OPEN', 'SPING_FOODS'];
const STATUS = ['PLANEJADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'];

const competicaoValidator = [
    body('nome')
        .notEmpty().withMessage('Nome e obrigatorio')
        .isLength({ max: 150 }).withMessage('Nome deve ter no maximo 150 caracteres'),

    body('tipo')
        .notEmpty().withMessage('Tipo e obrigatorio')
        .isIn(TIPOS).withMessage('Tipo invalido'),

    body('data_inicio')
        .notEmpty().withMessage('Data de inicio e obrigatoria')
        .isISO8601().withMessage('Data de inicio invalida'),

    body('data_fim')
        .optional({ nullable: true })
        .isISO8601().withMessage('Data de fim invalida'),

    body('status')
        .optional()
        .isIn(STATUS).withMessage('Status invalido'),

    body('local')
        .optional({ nullable: true })
        .isLength({ max: 180 }).withMessage('Local deve ter no maximo 180 caracteres')
];

module.exports = competicaoValidator;

