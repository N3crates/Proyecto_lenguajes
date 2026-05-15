const express = require("express")
const controller = require("./groups.controller")
const router = express.Router()

router.get("/", controller.getGroups)
router.get("/:id", controller.getGroupById)
router.get("/teacher/:teacherId", controller.getGroupsByTeacher)
router.post("/", controller.createGroup)
router.put("/:id", controller.updateGroup)
router.delete("/:id", controller.deleteGroup)

module.exports = router