const express = require("express")
const controller = require("./teacher.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const teacherAccess = [authMiddleware, checkPermission('manage_teachers')]

//Solo authMiddleware
router.get("/by-user/:userId", authMiddleware, controller.getTeacherByUserId)

router.get("/",    teacherAccess, controller.getTeachers)
router.get("/:id", teacherAccess, controller.getTeacherById)
router.post("/",   teacherAccess, controller.createTeacher)
router.put("/:id", teacherAccess, controller.updateTeacher)
router.delete("/:id", teacherAccess, controller.deleteTeacher)

module.exports = router