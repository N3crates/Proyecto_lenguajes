const service = require("./teacher.service")

const getTeachers = async (req, res) => {
    try {
        const teachers = await service.getTeachers()
        res.json({
            success: true,
            data: teachers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createTeacher = async (req, res) => {
    try {
        const response = await service.createTeacher(req.body)
        res.status(201).json({
            success: true,
            message: "Docente creado",
            data: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getTeacherById = async (req, res) => {
    try {
        const teacher = await service.getTeacherById(req.params.id)
        res.json({
            success: true,
            data: teacher
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

const updateTeacher = async (req, res) => {
    try {
        const response = await service.updateTeacher(req.params.id, req.body)
        res.json({
            success: true,
            message: "Docente actualizado",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const deleteTeacher = async (req, res) => {
    try {
        const response = await service.deleteTeacher(req.params.id)
        res.json({
            success: true,
            message: "Docente dado de baja",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getTeachers,
    createTeacher,
    getTeacherById,
    updateTeacher,
    deleteTeacher
}