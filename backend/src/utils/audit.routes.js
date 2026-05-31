const express = require('express');
const router = express.Router();
const auditController = require('./audit.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { checkRole } = require('../middlewares/role.middleware');

router.get('/', [authMiddleware, checkRole(['admin'])], auditController.getAuditLogs);

module.exports = router;