const service = require("./enrollment.service")

const getEnrollments = async(req, res) => {
    try {
        const enrollments = await service.getEnrollments()
        res.json({ success: true, data: enrollments })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const createEnrollment = async(req, res) => {
    try {
        const response = await service.createEnrollment(req.body)
        res.status(201).json({ success: true, message: "Inscripcion creada", data: response })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

const getEnrollmentById = async(req, res) => {
    try {
        const enrollment = await service.getEnrollmentById(req.params.id)
        res.json({ success: true, data: enrollment })
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}

const getEnrollmentByStudentId = async(req, res) => {
    try {
        const enrollments = await service.getEnrollmentByStudentId(req.params.studentId)
        res.json({ success: true, data: enrollments })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getEnrollmentsByGroupId = async(req, res) => {
    try {
        const enrollments = await service.getEnrollmentsByGroupId(req.params.groupId)
        res.json({ success: true, data: enrollments })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteEnrollment = async(req, res) => {
    try {
        const response = await service.deleteEnrollment(req.params.id)
        res.json({ success: true, message: "Inscripcion eliminada", data: response })
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}

const updateEnrollment = async(req, res) => {
    try {
        const response = await service.updateEnrollment(req.params.id, req.body)
        res.json({ success: true, message: "Inscripcion Actualizada", data: response })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

module.exports = {
    getEnrollments,
    createEnrollment,
    getEnrollmentById,
    getEnrollmentByStudentId,
    getEnrollmentsByGroupId,
    deleteEnrollment,
    updateEnrollment
}