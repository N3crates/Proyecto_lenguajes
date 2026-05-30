const express = require("express")
const controller = require("./teacher.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const teacherAccess = [authMiddleware, checkPermission('manage_teachers')]

//Solo authMiddleware
router.get("/by-user/:userId", authMiddleware, controller.getTeacherByUserId)

router.get("/",    authMiddleware, controller.getTeachers)
router.get("/:id", authMiddleware, controller.getTeacherById)
router.post("/",   [authMiddleware, checkPermission('manage_teachers')], controller.createTeacher)
router.put("/:id", [authMiddleware, checkPermission('manage_teachers')], controller.updateTeacher)
router.delete("/:id", [authMiddleware, checkPermission('manage_teachers')], controller.deleteTeacher)

module.exports = router