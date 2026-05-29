const express = require("express")
const controller = require("./groups.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const manageGroups  = [authMiddleware, checkPermission('manage_groups')]
const viewGroups    = [authMiddleware, checkPermission('view_own_groups')]

router.get("/teacher/:teacherId", authMiddleware, controller.getGroupsByTeacher)

router.get("/",    authMiddleware, controller.getGroups)
router.get("/:id", authMiddleware, controller.getGroupById)
router.post("/",   manageGroups,   controller.createGroup)
router.put("/:id", manageGroups,   controller.updateGroup)
router.delete("/:id", manageGroups, controller.deleteGroup)

module.exports = router