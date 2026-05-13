const express = require("express")
const controller = require("./enrollment.controller")
const router = express.Router()
router.get("/", controller.getEnrollments)
router.get("/student/:studentId", controller.getEnrollmentByStudentId)
router.get("/:id", controller.getEnrollmentById)
router.post("/", controller.createEnrollment)
router.delete("/:id", controller.deleteEnrollment)
module.exports = router;