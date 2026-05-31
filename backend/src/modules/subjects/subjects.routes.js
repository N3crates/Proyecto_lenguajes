const express = require("express")
const controller = require("./subjects.controller")
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { checkPermission } = require('../../middlewares/role.middleware')

const manageSubjects = [authMiddleware, checkPermission('manage_groups')]

router.get("/",    authMiddleware, controller.getSubjects)
router.get("/:id", authMiddleware, controller.getSubjectById)
router.post("/",   manageSubjects, controller.createSubject)
router.put("/:id", manageSubjects, controller.updateSubject)
router.delete("/:id", manageSubjects, controller.deleteSubject)

module.exports = router