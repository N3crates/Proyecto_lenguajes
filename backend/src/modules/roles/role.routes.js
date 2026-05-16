const express = require('express');
const router = express.Router();
const roleController = require('./role.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const checkRole = require('../../middlewares/role.middleware');

//Aplicamos middlewares a TODAS las rutas de roles
// Solo los administradores deberían poder gestionar roles
const adminOnly = [authMiddleware, checkRole(['admin'])];

router.get('/', adminOnly, roleController.getRoles);
router.post('/', adminOnly, roleController.createRole);
router.put('/:id', adminOnly, roleController.updateRole);
router.delete('/:id', adminOnly, roleController.deleteRole);

module.exports = router;