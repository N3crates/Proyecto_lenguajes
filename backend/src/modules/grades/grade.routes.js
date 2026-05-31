const express = require("express")
const controller = require("./grade.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const manageGrades = [authMiddleware, checkPermission('manage_grades')]
const viewGrades   = [authMiddleware, checkPermission('view_own_grades')]

router.get("/",                        authMiddleware, controller.getGrades)
router.get("/enrollment/:enrollmentId",authMiddleware, controller.getGradesByEnrollmentId)
router.post("/",   [authMiddleware, checkPermission('manage_grades')], controller.createGrade)
router.put("/:id", [authMiddleware, checkPermission('manage_grades')], controller.updateGrade)
router.delete("/:id",[authMiddleware, checkPermission('manage_grades')],controller.deleteGrade)

module.exports = router