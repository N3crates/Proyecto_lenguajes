const repository = require("./grade.repository")
const validation = require("./grade.validation")

const getGrades = async() => {
    return await repository.getAllGrades()
}

const createGrade = async(gradeData) => {
    const errors = validation.validateGrade(gradeData)

    if(errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    const finalGrade = (gradeData.partial1 + gradeData.partial2 + gradeData.partial3) / 3

    gradeData.finalGrade = Number(finalGrade.toFixed(2))
    gradeData.status = true
    gradeData.createdAt = new Date()

    return await repository.createGrade(gradeData)
}
const getGradesByEnrollmentId = async(enrollmentId) => {
    return await repository.getGradesByEnrollmentId(enrollmentId)
}

const updateGrade = async(IdleDeadline, gradeData) => {
    const errors = validation.validateGrade(gradeData)

    if(errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    const finalGrade = (gradeData.partial1 + gradeData.partial2 + gradeData.partial3)/3

    gradeData.finalGrade = Number(finalGrade.toFixed(2))
    gradeData.updatedAt = new Date()

    return await repository.updateGrade(IdleDeadline, gradeData)
}

const deleteGrade = async(id) => {
    return await repository.deleteGrade(id)
}

module.exports = {
    getGrades,
    createGrade,
    getGradesByEnrollmentId,
    updateGrade,
    deleteGrade
}