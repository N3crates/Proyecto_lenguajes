const repository = require("./student.repository")
const validation = require("./student.validation")
const { createAuditLog } = require('../../utils/audit.service')

const getStudents = async () => {
    return await repository.getAllStudents()
}

const getStudentsById = async (id) => {
    const student = await repository.getStudentsById(id)
    if (!student) throw new Error("Alumno no encontrado")
    return student
}

const updateStudent = async (id, studentData, adminId) => {
    const student = await repository.getStudentsById(id)
    if (!student) throw new Error("Alumno no encontrado")

    const errors = validation.validateStudent(studentData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    studentData.updatedAt = new Date()
    const result = await repository.updateStudent(id, studentData)

    await createAuditLog(adminId, 'UPDATE_STUDENT', { studentId: id, updates: studentData })

    return result
}

const deleteStudent = async (id, adminId) => {
    const student = await repository.getStudentsById(id)
    if (!student) throw new Error("Alumno no encontrado")

    const result = await repository.deleteStudent(id)

    await createAuditLog(adminId, 'DELETE_STUDENT', {
        studentId: id,
        name:      student.name || `${student.nombre} ${student.apaterno}`
    })

    return result
}

module.exports = { getStudents, getStudentsById, updateStudent, deleteStudent }