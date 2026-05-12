const service = require("./subject.service")

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