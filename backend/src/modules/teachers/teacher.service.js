const repository = require("./teacher.repository")
const validation = require("./teacher.validation")
const { createAuditLog } = require('../../utils/audit.service')

const getTeachers = async () => {
    return await repository.getAllTeachers()
}

const createTeacher = async (teacherData, adminId) => {
    const errors = validation.validateTeacher(teacherData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    teacherData.amaterno  = teacherData.amaterno || ''
    teacherData.ciudad    = teacherData.ciudad   || ''
    teacherData.status    = true
    teacherData.createdAt = new Date()

    const saved = await repository.createTeacher(teacherData)

    await createAuditLog(adminId, 'CREATE_TEACHER', {
        teacherId: saved.id,
        name:      `${teacherData.nombre} ${teacherData.apaterno}`
    })

    return saved
}

const getTeacherById = async (id) => {
    const teacher = await repository.getTeacherById(id)
    if (!teacher) throw new Error("Docente no encontrado")
    return teacher
}

const updateTeacher = async (id, teacherData, adminId) => {
    const teacher = await repository.getTeacherById(id)
    if (!teacher) throw new Error("Docente no encontrado")

    const errors = validation.validateTeacher(teacherData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    teacherData.updatedAt = new Date()
    const result = await repository.updateTeacher(id, teacherData)

    await createAuditLog(adminId, 'UPDATE_TEACHER', { teacherId: id, updates: teacherData })

    return result
}

const deleteTeacher = async (id, adminId) => {
    const teacher = await repository.getTeacherById(id)
    if (!teacher) throw new Error("Docente no encontrado")

    const result = await repository.deleteTeacher(id)

    await createAuditLog(adminId, 'DELETE_TEACHER', {
        teacherId: id,
        name:      `${teacher.nombre} ${teacher.apaterno}`
    })

    return result
}

const getTeacherByUserId = async (userId) => {
    const teacher = await repository.getTeacherByUserId(userId)
    if (!teacher) throw new Error("Perfil de docente no encontrado")
    return teacher
}

module.exports = { getTeachers, createTeacher, getTeacherById, updateTeacher, deleteTeacher, getTeacherByUserId }