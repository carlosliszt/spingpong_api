const express = require('express');
const router = express.Router();

const JogoController = require('../controllers/JogoController');
const SetJogoController = require('../controllers/SetJogoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { jogoValidator, registrarResultadoValidator } = require('../validators/jogoValidator');
const setJogoValidator = require('../validators/setJogoValidator');
const validate = require('../middlewares/validationMiddleware');

router.get('/', JogoController.getAll);
router.get('/:id', JogoController.getById);
router.get('/:jogoId/sets', SetJogoController.getByJogo);

router.post('/', authMiddleware, jogoValidator, validate, JogoController.create);
router.post('/registrar-resultado-jogo', authMiddleware, registrarResultadoValidator, validate, JogoController.registrarResultado);
router.put('/:id', authMiddleware, JogoController.update);
router.delete('/:id', authMiddleware, JogoController.delete);

router.post('/sets', authMiddleware, setJogoValidator, validate, SetJogoController.create);
router.put('/sets/:id', authMiddleware, SetJogoController.update);
router.delete('/sets/:id', authMiddleware, SetJogoController.delete);

module.exports = router;
