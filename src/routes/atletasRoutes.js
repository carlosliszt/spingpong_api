const express = require('express');
const router = express.Router();

const AtletaController = require('../controllers/AtletaController');
const authMiddleware = require('../middlewares/authMiddleware');
const atletaValidator = require('../validators/atletaValidator');
const validate = require('../middlewares/validationMiddleware');

router.get('/', AtletaController.getAll);
router.get('/ranking', AtletaController.getRanking);
router.get('/:id', AtletaController.getById);

router.post('/', authMiddleware, atletaValidator, validate, AtletaController.create);
router.put('/:id', authMiddleware, AtletaController.update);
router.delete('/:id', authMiddleware, AtletaController.delete);

module.exports = router;

