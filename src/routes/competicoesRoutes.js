const express = require('express');
const router = express.Router();

const CompeticaoController = require('../controllers/CompeticaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const competicaoValidator = require('../validators/competicaoValidator');
const validate = require('../middlewares/validationMiddleware');

router.get('/', CompeticaoController.getAll);
router.get('/:id', CompeticaoController.getById);
router.get('/:id/classificacao-grupo/:groupId', CompeticaoController.getClassificacaoGrupo);
router.get('/:id/bracket', CompeticaoController.getBracket);

router.post('/', authMiddleware, competicaoValidator, validate, CompeticaoController.create);
router.put('/:id', authMiddleware, CompeticaoController.update);
router.delete('/:id', authMiddleware, CompeticaoController.delete);

router.post('/gerar-grupos-balanceados', authMiddleware, CompeticaoController.gerarGruposBalanceados);
router.post('/gerar-jogos-grupo', authMiddleware, CompeticaoController.gerarJogosGrupo);
router.post('/finalizar-grupos', authMiddleware, CompeticaoController.finalizarGrupos);
router.post('/gerar-mata-mata', authMiddleware, CompeticaoController.gerarMataMata);

module.exports = router;
