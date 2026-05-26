const repository = require("./enrollment.repository")
const validation = require("./enrollment.validation")
const { createAuditLog } = require('../../utils/audit.service')

const getEnrollments = async () => {
    return await repository.getAllEnrollments()
}

const createEnrollment = async (enrollmentData, adminId) => {
    const errors = validation.validateEnrollment(enrollmentData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    const duplicate = await repository.findDuplicateEnrollment(
        enrollmentData.studentId, enrollmentData.subject, enrollmentData.group)
    if (duplicate) throw new Error("El alumno ya esta inscrito en esta materia y grupo")

    enrollmentData.status  = true
    enrollmentData.createdAt = new Date()

    const saved = await repository.createEnrollment(enrollmentData)

    await createAuditLog(adminId, 'CREATE_ENROLLMENT', {
        enrollmentId: saved.id,
        studentId:    enrollmentData.studentId,
        subject:      enrollmentData.subject,
        group:        enrollmentData.group
    })

    return saved
}

const getEnrollmentById = async (id) => {
    const enrollment = await repository.getEnrollmentById(id)
    if (!enrollment) throw new Error("Inscripcion no encontrada")
    return enrollment
}

const getEnrollmentByStudentId = async (studentId) => {
    return await repository.getEnrollmentByStudentId(studentId)
}

const deleteEnrollment = async (id, adminId) => {
    const enrollment = await repository.getEnrollmentById(id)
    if (!enrollment) throw new Error("Inscripción no encontrada")

    const result = await repository.deleteEnrollment(id)

    await createAuditLog(adminId, 'DELETE_ENROLLMENT', {
        enrollmentId: id,
        studentId:    enrollment.studentId,
        subject:      enrollment.subject
    })

    return result
}

const updateEnrollment = async (id, enrollmentData, adminId) => {
    const enrollment = await repository.getEnrollmentById(id)
    if (!enrollment) throw new Error("Inscripción no encontrada")

    const errors = validation.validateEnrollment(enrollmentData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    const duplicate = await repository.findDuplicateEnrollment(
        enrollmentData.studentId, enrollmentData.subject, enrollmentData.group)
    if (duplicate && (
        enrollment.studentId !== enrollmentData.studentId ||
        enrollment.subject   !== enrollmentData.subject   ||
        enrollment.group     !== enrollmentData.group
    )) throw new Error("Ya existe una inscripción")

    enrollmentData.updatedAt = new Date()
    const result = await repository.updateEnrollment(id, enrollmentData)

    await createAuditLog(adminId, 'UPDATE_ENROLLMENT', {
        enrollmentId: id,
        updates:      enrollmentData
    })

    return result
}

module.exports = {
    getEnrollments, createEnrollment, getEnrollmentById,
    getEnrollmentByStudentId, deleteEnrollment, updateEnrollment
}