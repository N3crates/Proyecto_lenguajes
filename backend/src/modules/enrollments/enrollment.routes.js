const express = require("express")
const controller = require("./enrollment.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const manageEnrollments = [authMiddleware, checkPermission('manage_students')]
const viewEnrollments   = [authMiddleware]

router.get("/",                    viewEnrollments,   controller.getEnrollments)
router.get("/student/:studentId",  viewEnrollments,   controller.getEnrollmentByStudentId)
router.get("/:id",                 viewEnrollments,   controller.getEnrollmentById)
router.post("/",                   manageEnrollments, controller.createEnrollment)
router.put("/:id",                 manageEnrollments, controller.updateEnrollment)
router.delete("/:id",              manageEnrollments, controller.deleteEnrollment)

module.exports = router