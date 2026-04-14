const express = require('express');
const router = express.Router();

const HistoricoController = require('../controllers/HistoricoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/resultados', authMiddleware, HistoricoController.resultados);
router.get('/resultados/:id', authMiddleware, HistoricoController.resultadoById);
router.post('/resultados', authMiddleware, HistoricoController.createResultado);
router.put('/resultados/:id', authMiddleware, HistoricoController.updateResultado);
router.delete('/resultados/:id', authMiddleware, HistoricoController.deleteResultado);

router.get('/rating', authMiddleware, HistoricoController.rating);
router.get('/rating/:id', authMiddleware, HistoricoController.ratingById);
router.post('/rating', authMiddleware, HistoricoController.createRating);
router.put('/rating/:id', authMiddleware, HistoricoController.updateRating);
router.delete('/rating/:id', authMiddleware, HistoricoController.deleteRating);

module.exports = router;
