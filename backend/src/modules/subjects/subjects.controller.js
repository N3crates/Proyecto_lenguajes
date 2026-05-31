const service = require("./subjects.service")

// Obtener todas las materias
const getSubjects = async (req, res) => {
    try {
        const subjects = await service.getSubjects()
        res.json({
            success: true,
            data: subjects
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Crear una nueva materia
const createSubject = async (req, res) => {
    try {
        const response = await service.createSubject(req.body)
        res.status(201).json({
            success: true,
            message: "Materia creada",
            data: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Obtener una materia por su id
const getSubjectById = async (req, res) => {
    try {
        const subject = await service.getSubjectById(req.params.id)
        res.json({
            success: true,
            data: subject
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Editar los datos de una materia por su id
const updateSubject = async (req, res) => {
    try {
        const response = await service.updateSubject(req.params.id, req.body)
        res.json({
            success: true,
            message: "Materia actualizada",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Baja de una materia por su id
const deleteSubject = async (req, res) => {
    try {
        const response = await service.deleteSubject(req.params.id)
        res.json({
            success: true,
            message: "Materia dada de baja",
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
    getSubjects,
    createSubject,
    getSubjectById,
    updateSubject,
    deleteSubject
}