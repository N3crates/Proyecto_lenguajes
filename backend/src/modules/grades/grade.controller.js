const service = require("./grade.service")

const getGrades = async(req, res) => {
    try {
        const grades = await service.getGrades()

        res.json({
            success: true,
            data: grades
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createGrade = async(req, res) => {
    try {
        const response = await service.createGrade(req.body)

        res.status(201).json({
            success: true,
            message: "Calificación creada",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getGradesByEnrollmentId = async(req, res) => {
    try {
        const grades = await service.getGradesByEnrollmentId(req.params.enrollmentId)

        res.json({
            success: true,
            data: grades
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateGrade = async(req, res) => {
    try {
        const response = await service.updateGrade(req.params.id, req.body)

        res.json({
            success: true,
            message: "Calificación actualizada",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}

const deleteGrade = async(req, res) => {
    try {
        const response = await service.deleteGrade(req.params.id)

        res.json({
            success: true,
            message: "Calificación eliminada",
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
    getGrades,
    createGrade,
    getGradesByEnrollmentId,
    updateGrade,
    deleteGrade
}