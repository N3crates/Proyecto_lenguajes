const express = require("express")
const controller = require("./student.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const studentAccess = [authMiddleware, checkPermission('manage_students')]

router.get("/",    studentAccess, controller.getStudents)
router.get("/:id", studentAccess, controller.getStudentsById)
router.put("/:id", studentAccess, controller.updateStudent)
router.delete("/:id", studentAccess, controller.deleteStudent)

module.exports = router