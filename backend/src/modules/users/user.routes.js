const express = require('express');
const router = express.Router();

// const userController = require('./user.controller');
// const authMiddleware = require('../../middlewares/auth.middleware');
// const checkRole = require('../../middlewares/role.middleware');

// const adminOnly = [authMiddleware, checkRole(['admin'])];

// router.get('/', adminOnly, userController.getAllUsers);
// router.get('/:id', adminOnly, userController.getUserById);
// router.post('/', adminOnly, userController.createUser);
// router.put('/:id', adminOnly, userController.updateUser);
// router.patch('/:id/status', adminOnly, userController.changeUserStatus);
// router.delete('/:id', adminOnly, userController.deleteUser);

module.exports = router;