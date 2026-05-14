const express = require("express")
const controller = require("./grade.controller")
const router = express.Router()
router.get("/", controller.getGrades)
router.get("/enrollment/:enrollmentId", controller.getGradesByEnrollmentId)
router.post("/", controller.createGrade)
router.put("/:id", controller.updateGrade)
router.delete("/:id", controller.deleteGrade)
module.exports = router