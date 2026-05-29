// Rutas del modulo de grupos
const express = require("express")
const controller = require("./groups.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

<<<<<<< HEAD
const manageGroups  = [authMiddleware, checkPermission('manage_groups')]
const viewGroups    = [authMiddleware, checkPermission('view_own_groups')]

router.get("/teacher/:teacherId", authMiddleware, controller.getGroupsByTeacher)

router.get("/",    authMiddleware, controller.getGroups)
router.get("/:id", authMiddleware, controller.getGroupById)
router.post("/",   manageGroups,   controller.createGroup)
router.put("/:id", manageGroups,   controller.updateGroup)
router.delete("/:id", manageGroups, controller.deleteGroup)
=======
// Obtener todos los grupos
router.get("/", controller.getGroups)
router.get("/teacher/:teacherId", controller.getGroupsByTeacher)
router.get("/:id", controller.getGroupById)
router.post("/", controller.createGroup)
router.put("/:id", controller.updateGroup)
router.delete("/:id", controller.deleteGroup)
>>>>>>> develop

module.exports = router