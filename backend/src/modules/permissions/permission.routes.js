const express = require('express');
const router = express.Router();
const permissionController = require('./permission.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const checkRole = require('../../middlewares/role.middleware');

// Solo administradores pueden ver la lista de permisos para asignarlos a roles
router.get('/', [authMiddleware, checkRole(['admin'])], permissionController.getPermissions);

module.exports = router;