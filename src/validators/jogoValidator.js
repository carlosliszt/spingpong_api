const { body } = require('express-validator');

const STATUS = ['AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'W_O', 'CANCELADO'];

const jogoValidator = [
    body('competicao_id')
        .notEmpty().withMessage('Competicao e obrigatoria')
        .isInt({ min: 1 }).withMessage('competicao_id invalido'),

    body('fase')
        .notEmpty().withMessage('Fase e obrigatoria')
        .isLength({ max: 30 }).withMessage('Fase deve ter no maximo 30 caracteres'),

    body('rodada')
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('Rodada deve ser inteiro positivo'),

    body('atleta_a_id')
        .notEmpty().withMessage('atleta_a_id e obrigatorio')
        .isInt({ min: 1 }).withMessage('atleta_a_id invalido'),

    body('atleta_b_id')
        .notEmpty().withMessage('atleta_b_id e obrigatorio')
        .isInt({ min: 1 }).withMessage('atleta_b_id invalido'),

    body('vencedor_id')
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('vencedor_id invalido'),

    body('status')
        .optional()
        .isIn(STATUS).withMessage('Status invalido'),

    body('data_hora_prevista')
        .optional({ nullable: true })
        .isISO8601().withMessage('data_hora_prevista invalida'),

    body('data_hora_inicio')
        .optional({ nullable: true })
        .isISO8601().withMessage('data_hora_inicio invalida'),

    body('data_hora_fim')
        .optional({ nullable: true })
        .isISO8601().withMessage('data_hora_fim invalida')
];

const registrarResultadoValidator = [
    body('jogoId')
        .optional()
        .isInt({ min: 1 }).withMessage('jogoId invalido'),

    body('jogo_id')
        .optional()
        .isInt({ min: 1 }).withMessage('jogo_id invalido'),

    body('sets')
        .isArray({ min: 1 }).withMessage('sets deve ser um array com ao menos 1 item'),

    body('sets.*.numero_set')
        .optional()
        .isInt({ min: 1 }).withMessage('numero_set invalido'),

    body('sets.*.pontos_a')
        .optional()
        .isInt({ min: 0 }).withMessage('pontos_a invalido'),

    body('sets.*.pontos_b')
        .optional()
        .isInt({ min: 0 }).withMessage('pontos_b invalido'),

    body('sets.*.pontos_atleta_a')
        .optional()
        .isInt({ min: 0 }).withMessage('pontos_atleta_a invalido'),

    body('sets.*.pontos_atleta_b')
        .optional()
        .isInt({ min: 0 }).withMessage('pontos_atleta_b invalido')
];

module.exports = {
    jogoValidator,
    registrarResultadoValidator
};
