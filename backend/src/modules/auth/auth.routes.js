const express = require('express');
const router = express.Router();
const authController = require('./auth.controller'); 
const authMiddleware = require('../../middlewares/auth.middleware');


//Rutas Publicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

//Rutas privadas -> Requieren Token
router.get('/me', authMiddleware, authController.getProfile);
router.patch('/change-password', authMiddleware, authController.changePassword);

module.exports = router;