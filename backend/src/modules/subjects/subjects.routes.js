const express = require("express")
const controller = require("./subject.controller")
const router = express.Router()

router.get("/", controller.getSubjects)
router.get("/:id", controller.getSubjectById)
router.post("/", controller.createSubject)
router.put("/:id", controller.updateSubject)
router.delete("/:id", controller.deleteSubject)

module.exports = router