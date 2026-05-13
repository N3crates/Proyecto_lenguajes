const repository = require("./enrollment.repository")
const validation = require("./enrollment.validation")

const getEnrollments = async() => {
    return await repository.getAllEnrollments()
}

const createEnrollment = async(enrollmentData) => {
    const errors= validation.validateEnrollment(enrollmentData)

    if(errors.length > 0) {
        throw new Error(errors.join(", "))
    }
    enrollmentData.status = true
    enrollmentData.createdAt = new Date()

    return await repository.createEnrollment(enrollmentData)
}

const getEnrollmentById = async(id) => {
    const enrollment = await repository.getEnrollmentById(id)

    if(!enrollment) {
        throw new Error("Inscripcion no encontrada")
    }
    return enrollment
}

const getEnrollmentByStudentId = async(studentId) => {
    return await repository.getEnrollmentByStudentId(studentId)
}

const deleteEnrollment = async(id) => {
    const enrollment = await repository.getEnrollmentById(id)

    if(!enrollment) {
        throw new Error("Inscripción no encontrada")
    }
    return await repository.deleteEnrollment(id)
}

module.exports = {
    getEnrollments,
    createEnrollment,
    getEnrollmentById,
    getEnrollmentByStudentId,
    deleteEnrollment
}