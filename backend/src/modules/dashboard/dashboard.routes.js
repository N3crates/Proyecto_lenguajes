const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Cualquier usuario logueado podría ver el dashboard, 
// o solo a 'admin' agregando el checkRole
router.get('/summary', authMiddleware, dashboardController.getSummary);

module.exports = router;
