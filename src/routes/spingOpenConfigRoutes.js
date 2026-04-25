const express = require('express');
const SpingOpenConfigController = require('../controllers/SpingOpenConfigController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /sping-open-config - listar todas as configurações
router.get('/', (req, res) => SpingOpenConfigController.getAll(req, res));

// GET /sping-open-config/default - obter configuração padrão
router.get('/default', (req, res) => SpingOpenConfigController.getDefault(req, res));

// GET /sping-open-config/active - obter configuração ativa
router.get('/active', (req, res) => SpingOpenConfigController.getActive(req, res));

// GET /sping-open-config/:id - obter por ID
router.get('/:id', (req, res) => SpingOpenConfigController.getById(req, res));

// POST /sping-open-config - criar nova configuração
router.post('/', (req, res) => SpingOpenConfigController.create(req, res));

// PUT /sping-open-config/:id - atualizar configuração
router.put('/:id', (req, res) => SpingOpenConfigController.update(req, res));

// DELETE /sping-open-config/:id - deletar configuração
router.delete('/:id', (req, res) => SpingOpenConfigController.delete(req, res));

module.exports = router;

