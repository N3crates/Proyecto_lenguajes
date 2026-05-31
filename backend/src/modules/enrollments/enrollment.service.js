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
        enrollmentData.studentId, enrollmentData.subjectId, enrollmentData.groupId)
    if (duplicate) throw new Error("El alumno ya esta inscrito en esta materia y grupo")

    enrollmentData.status    = true
    enrollmentData.createdAt = new Date()

    const saved = await repository.createEnrollment(enrollmentData)

    await createAuditLog(adminId, 'CREATE_ENROLLMENT', {
        enrollmentId: saved.id,
        studentId:    enrollmentData.studentId,
        subjectId:    enrollmentData.subjectId,
        groupId:      enrollmentData.groupId
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

// Obtener inscripciones por groupId
const getEnrollmentsByGroupId = async (groupId) => {
    return await repository.getEnrollmentsByGroupId(groupId)
}

const deleteEnrollment = async (id, adminId) => {
    const enrollment = await repository.getEnrollmentById(id)
    if (!enrollment) throw new Error("Inscripcion no encontrada")

    const result = await repository.deleteEnrollment(id)

    await createAuditLog(adminId, 'DELETE_ENROLLMENT', {
        enrollmentId: id,
        studentId:    enrollment.studentId,
        subjectId:    enrollment.subjectId
    })

    return result
}

const updateEnrollment = async (id, enrollmentData, adminId) => {
    const enrollment = await repository.getEnrollmentById(id)
    if (!enrollment) throw new Error("Inscripcion no encontrada")

    const errors = validation.validateEnrollment(enrollmentData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    const duplicate = await repository.findDuplicateEnrollment(
        enrollmentData.studentId, enrollmentData.subjectId, enrollmentData.groupId)
    if (duplicate && (
        enrollment.studentId !== enrollmentData.studentId ||
        enrollment.subjectId !== enrollmentData.subjectId ||
        enrollment.groupId !== enrollmentData.groupId
    )) throw new Error("Ya existe una inscripcion")

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
    getEnrollmentByStudentId, getEnrollmentsByGroupId,
    deleteEnrollment, updateEnrollment
}