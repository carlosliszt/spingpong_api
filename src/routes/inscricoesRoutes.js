const express = require('express');
const router = express.Router();

const InscricaoCompeticaoController = require('../controllers/InscricaoCompeticaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const inscricaoCompeticaoValidator = require('../validators/inscricaoCompeticaoValidator');
const validate = require('../middlewares/validationMiddleware');

router.get('/', authMiddleware, InscricaoCompeticaoController.getAll);
router.get('/:id', authMiddleware, InscricaoCompeticaoController.getById);
router.post('/', authMiddleware, inscricaoCompeticaoValidator, validate, InscricaoCompeticaoController.create);
router.put('/:id', authMiddleware, InscricaoCompeticaoController.update);
router.delete('/:id', authMiddleware, InscricaoCompeticaoController.delete);

module.exports = router;

