const express = require("express")
const controller = require("./student.controller")
const router = express.Router()
router.get("/", controller.getStudents)
router.get("/:id", controller.getStudentsById)
router.put("/:id", controller.updateStudent)
router.delete("/:id", controller.deleteStudent)
module.exports = router