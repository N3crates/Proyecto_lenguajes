const express = require("express")
const controller = require("./student.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const studentAccess = [authMiddleware, checkPermission('manage_students')]

router.get("/",    authMiddleware, controller.getStudents)
router.get("/:id", authMiddleware, controller.getStudentsById)
router.put("/:id",    [authMiddleware, checkPermission('manage_students')], controller.updateStudent)
router.delete("/:id", [authMiddleware, checkPermission('manage_students')], controller.deleteStudent)

module.exports = router