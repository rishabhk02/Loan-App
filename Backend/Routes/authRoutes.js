const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/authController');
const { authMiddleware, adminMiddleware } = require('../Middlewares/authMiddlewares');

router.post('/signup', AuthController.signup);

router.post('/login', AuthController.login);

router.get('/validateToken', authMiddleware, AuthController.validateToken);

router.get('/getAllUsers', authMiddleware, adminMiddleware, AuthController.getAllUsers);

module.exports = router;