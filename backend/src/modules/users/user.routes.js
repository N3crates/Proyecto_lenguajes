const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { checkRole, checkPermission } = require('../../middlewares/role.middleware');

// Gestión de usuarios — requiere permiso, no rol fijo
const userAccess = [authMiddleware, checkPermission('manage_users')];

router.get('/',              userAccess, userController.getAllUsers);
router.get('/:id',           userAccess, userController.getUserById);
router.post('/',             userAccess, userController.createUser);
router.put('/:id',           userAccess, userController.updateUser);
router.patch('/:id/status',  userAccess, userController.changeUserStatus);
router.delete('/:id',        userAccess, userController.deleteUser);

module.exports = router;