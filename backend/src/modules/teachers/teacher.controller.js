const service = require("./teacher.service")

// Obtener todos los docentes
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

// Crear un nuevo docente
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

// Obtener un docente por su id
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

// Editar los datos de un docente por su id
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

// Baja de un docente por su id
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

// Obtener el perfil de docente usando el userId del usuario que esta logeado
const getTeacherByUserId = async (req, res) => {
    try {
        const teacher = await service.getTeacherByUserId(req.params.userId)
        res.json({ success: true, data: teacher })
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}

module.exports = {
    getTeachers,
    createTeacher,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getTeacherByUserId
}