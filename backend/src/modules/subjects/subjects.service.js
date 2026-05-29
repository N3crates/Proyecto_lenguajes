const repository = require("./subjects.repository")
const validation = require("./subjects.validation")
const { createAuditLog } = require('../../utils/audit.service')

// Obtener todas las materias
const getSubjects = async () => {
    return await repository.getAllSubjects()
}

// Crear una materia nueva con validacion y registro en auditoria
const createSubject = async (subjectData, adminId) => {
    const errors = validation.validateSubject(subjectData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    // Valores por defecto antes de guardar
    subjectData.descripcion = subjectData.descripcion || ''
    subjectData.status      = true
    subjectData.createdAt   = new Date()

    const saved = await repository.createSubject(subjectData)

    // Registro en auditoria
    await createAuditLog(adminId, 'CREATE_SUBJECT', {
        subjectId:   saved.id,
        subjectName: subjectData.name || subjectData.nombre
    })

    return saved
}

// Obtener una materia por su id y verifica si exise
const getSubjectById = async (id) => {
    const subject = await repository.getSubjectById(id)
    if (!subject) throw new Error("Materia no encontrada")
    return subject
}

// Actualizar una materia con validacion y registro en auditoria
const updateSubject = async (id, subjectData, adminId) => {
    const subject = await repository.getSubjectById(id)
    if (!subject) throw new Error("Materia no encontrada")

    // Validar los datos enviados
    const errors = validation.validateSubject(subjectData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    // Registrar fecha de actualizacion
    subjectData.updatedAt = new Date()
    const result = await repository.updateSubject(id, subjectData)

    // Registro en auditoria
    await createAuditLog(adminId, 'UPDATE_SUBJECT', { subjectId: id, updates: subjectData })

    return result
}

// Baja logica de una materia con registro en auditoria
const deleteSubject = async (id, adminId) => {
    const subject = await repository.getSubjectById(id)
    if (!subject) throw new Error("Materia no encontrada")

    const result = await repository.deleteSubject(id)

    // Registro en auditoria
    await createAuditLog(adminId, 'DELETE_SUBJECT', {
        subjectId:   id,
        subjectName: subject.name || subject.nombre
    })

    return result
}

module.exports = { getSubjects, createSubject, getSubjectById, updateSubject, deleteSubject }