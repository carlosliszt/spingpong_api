const { body } = require('express-validator');

const setJogoValidator = [
    body('jogo_id')
        .notEmpty().withMessage('jogo_id e obrigatorio')
        .isInt({ min: 1 }).withMessage('jogo_id invalido'),

    body('numero_set')
        .notEmpty().withMessage('numero_set e obrigatorio')
        .isInt({ min: 1 }).withMessage('numero_set invalido'),

    body('pontos_atleta_a')
        .notEmpty().withMessage('pontos_atleta_a e obrigatorio')
        .isInt({ min: 0 }).withMessage('pontos_atleta_a invalido'),

    body('pontos_atleta_b')
        .notEmpty().withMessage('pontos_atleta_b e obrigatorio')
        .isInt({ min: 0 }).withMessage('pontos_atleta_b invalido'),

    body('vencedor_set_id')
        .optional({ nullable: true })
        .isInt({ min: 1 }).withMessage('vencedor_set_id invalido')
];

module.exports = setJogoValidator;

