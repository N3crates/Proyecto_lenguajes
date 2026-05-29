// Rutas del modulo de grupos
const express = require("express")
const controller = require("./groups.controller")
const router = express.Router()

// Obtener todos los grupos
router.get("/", controller.getGroups)
router.get("/teacher/:teacherId", controller.getGroupsByTeacher)
router.get("/:id", controller.getGroupById)
router.post("/", controller.createGroup)
router.put("/:id", controller.updateGroup)
router.delete("/:id", controller.deleteGroup)

module.exports = router