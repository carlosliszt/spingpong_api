const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validationMiddleware');

router.use(authMiddleware);

router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.getById);
router.post('/', registerValidator, validate, UsuarioController.create);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

module.exports = router;

