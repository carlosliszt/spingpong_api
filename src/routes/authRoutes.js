const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', registerValidator, validate, AuthController.register);
router.post('/login', loginValidator, validate, AuthController.login);
router.get('/me', authMiddleware, AuthController.me);

module.exports = router;
