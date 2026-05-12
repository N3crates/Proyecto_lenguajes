const express = require("express")
const controller = require("./student.controller")
const router = express.Router()
router.get("/", controller.getStudents)
router.post("/", controller.createStudent)
module.exports = router