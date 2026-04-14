const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const atletasRoutes = require('./atletasRoutes');
const competicoesRoutes = require('./competicoesRoutes');
const inscricoesRoutes = require('./inscricoesRoutes');
const jogosRoutes = require('./jogosRoutes');
const historicosRoutes = require('./historicosRoutes');

// root
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Spingpong - Gestao de atletas, competicoes, jogos e ranking',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            atletas: '/api/atletas',
            competicoes: '/api/competicoes',
            inscricoes: '/api/inscricoes',
            jogos: '/api/jogos',
            historicos: '/api/historicos'
        }
    });
});

// demais rotas
router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/atletas', atletasRoutes);
router.use('/competicoes', competicoesRoutes);
router.use('/inscricoes', inscricoesRoutes);
router.use('/jogos', jogosRoutes);
router.use('/historicos', historicosRoutes);

module.exports = router;
