const express = require("express")
const controller = require("./teacher.controller")
const router = express.Router()

router.get("/", controller.getTeachers)
router.get("/:id", controller.getTeacherById)
router.post("/", controller.createTeacher)
router.put("/:id", controller.updateTeacher)
router.delete("/:id", controller.deleteTeacher)

module.exports = router