const express = require('express');
const router = express.Router();
const roleController = require('./role.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { checkRole } = require('../../middlewares/role.middleware');

const adminOnly = [authMiddleware, checkRole(['admin'])];

// Cualquier autenticado puede leer roles
router.get('/', authMiddleware, roleController.getRoles);

// Solo admin puede modificar
router.post('/',      adminOnly, roleController.createRole);
router.put('/:id',    adminOnly, roleController.updateRole);
router.delete('/:id', adminOnly, roleController.deleteRole);

module.exports = router;