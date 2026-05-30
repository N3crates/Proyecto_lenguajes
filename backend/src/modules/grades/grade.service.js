const repository = require("./grade.repository")
const validation = require("./grade.validation")
const { createAuditLog } = require('../../utils/audit.service')

const getGrades = async () => {
    return await repository.getAllGrades()
}

const createGrade = async (gradeData, adminId) => {
    const errors = validation.validateGrade(gradeData)
    if (errors.length > 0) throw new Error(errors.join(", "))
    
    const existingGrade = await repository.findByEnrollmentId(gradeData.enrollmentId)

    if(existingGrade) throw new Error("Ya existe una calificación para esta inscripción")

    const finalGrade = (Number(gradeData.partial1) + Number(gradeData.partial2) + Number(gradeData.partial3)) / 3
    gradeData.finalGrade = Number(finalGrade.toFixed(2))
    gradeData.status     = true
    gradeData.createdAt  = new Date()

    const saved = await repository.createGrade(gradeData)

    await createAuditLog(adminId, 'CREATE_GRADE', {
        gradeId:      saved.id,
        enrollmentId: gradeData.enrollmentId,
        finalGrade:   gradeData.finalGrade
    })

    return saved
}

const getGradesByEnrollmentId = async (enrollmentId) => {
    return await repository.getGradesByEnrollmentId(enrollmentId)
}

const updateGrade = async (id, gradeData, adminId) => {
    const errors = validation.validateGrade(gradeData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    const finalGrade = (Number(gradeData.partial1) + Number(gradeData.partial2) + Number(gradeData.partial3)) / 3
    gradeData.finalGrade = Number(finalGrade.toFixed(2))
    gradeData.updatedAt  = new Date()

    const result = await repository.updateGrade(id, gradeData)

    await createAuditLog(adminId, 'UPDATE_GRADE', {
        gradeId:    id,
        finalGrade: gradeData.finalGrade,
        updates:    { partial1: gradeData.partial1, partial2: gradeData.partial2, partial3: gradeData.partial3 }
    })

    return result
}

const deleteGrade = async (id, adminId) => {
    const result = await repository.deleteGrade(id)

    await createAuditLog(adminId, 'DELETE_GRADE', { gradeId: id })

    return result
}

module.exports = { getGrades, createGrade, getGradesByEnrollmentId, updateGrade, deleteGrade }