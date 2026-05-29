const repository = require("./teacher.repository")
const validation = require("./teacher.validation")
const { createAuditLog } = require('../../utils/audit.service')

// Obtener todos los docentes
const getTeachers = async () => {
    return await repository.getAllTeachers()
}

// Crear un docente nuevo con validacion y registro de auditoria
const createTeacher = async (teacherData, adminId) => {
    // Validar los datos antes de guardar
    const errors = validation.validateTeacher(teacherData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    // Valores por defecto antes de guardar
    teacherData.amaterno  = teacherData.amaterno || ''
    teacherData.ciudad    = teacherData.ciudad   || ''
    teacherData.status    = true
    teacherData.createdAt = new Date()

    const saved = await repository.createTeacher(teacherData)

    // Registrar en auditoria
    await createAuditLog(adminId, 'CREATE_TEACHER', {
        teacherId: saved.id,
        name:      `${teacherData.nombre} ${teacherData.apaterno}`
    })

    return saved
}

// Obtener un docente por su ide
const getTeacherById = async (id) => {
    const teacher = await repository.getTeacherById(id)
    if (!teacher) throw new Error("Docente no encontrado")
    return teacher
}

// Actualizar un docente con validacion y registro de auditoria
const updateTeacher = async (id, teacherData, adminId) => {
    const teacher = await repository.getTeacherById(id)
    if (!teacher) throw new Error("Docente no encontrado")
    const errors = validation.validateTeacher(teacherData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    // Registrar fecha de actualizacion
    teacherData.updatedAt = new Date()
    const result = await repository.updateTeacher(id, teacherData)

    // Registrar en auditoria
    await createAuditLog(adminId, 'UPDATE_TEACHER', { teacherId: id, updates: teacherData })

    return result
}

// Baja logica de un docente
const deleteTeacher = async (id, adminId) => {
    // Verificar que el docente existe antes de dar de baja
    const teacher = await repository.getTeacherById(id)
    if (!teacher) throw new Error("Docente no encontrado")

    const result = await repository.deleteTeacher(id)

    // Registrar en auditoria
    await createAuditLog(adminId, 'DELETE_TEACHER', {
        teacherId: id,
        name:      `${teacher.nombre} ${teacher.apaterno}`
    })

    return result
}

// Obtener el perfil de docente usando el userId del usuario logueado
const getTeacherByUserId = async (userId) => {
    const teacher = await repository.getTeacherByUserId(userId)
    if (!teacher) throw new Error("Perfil de docente no encontrado")
    return teacher
}

module.exports = { getTeachers, createTeacher, getTeacherById, updateTeacher, deleteTeacher, getTeacherByUserId }