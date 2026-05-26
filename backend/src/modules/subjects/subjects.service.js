const repository = require("./subjects.repository")
const validation = require("./subjects.validation")
const { createAuditLog } = require('../../utils/audit.service')

const getSubjects = async () => {
    return await repository.getAllSubjects()
}

const createSubject = async (subjectData, adminId) => {
    const errors = validation.validateSubject(subjectData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    subjectData.descripcion = subjectData.descripcion || ''
    subjectData.status      = true
    subjectData.createdAt   = new Date()

    const saved = await repository.createSubject(subjectData)

    await createAuditLog(adminId, 'CREATE_SUBJECT', {
        subjectId:   saved.id,
        subjectName: subjectData.name || subjectData.nombre
    })

    return saved
}

const getSubjectById = async (id) => {
    const subject = await repository.getSubjectById(id)
    if (!subject) throw new Error("Materia no encontrada")
    return subject
}

const updateSubject = async (id, subjectData, adminId) => {
    const subject = await repository.getSubjectById(id)
    if (!subject) throw new Error("Materia no encontrada")

    const errors = validation.validateSubject(subjectData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    subjectData.updatedAt = new Date()
    const result = await repository.updateSubject(id, subjectData)

    await createAuditLog(adminId, 'UPDATE_SUBJECT', { subjectId: id, updates: subjectData })

    return result
}

const deleteSubject = async (id, adminId) => {
    const subject = await repository.getSubjectById(id)
    if (!subject) throw new Error("Materia no encontrada")

    const result = await repository.deleteSubject(id)

    await createAuditLog(adminId, 'DELETE_SUBJECT', {
        subjectId:   id,
        subjectName: subject.name || subject.nombre
    })

    return result
}

module.exports = { getSubjects, createSubject, getSubjectById, updateSubject, deleteSubject }