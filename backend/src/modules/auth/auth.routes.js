const express = require('express');
const router = express.Router();
const authController = require('./auth.controller'); 
const authMiddleware = require('../../middlewares/auth.middleware');

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Módulo auth funcionando'
  });
});

router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;