const repository = require("./subject.repository")
const validation = require("./subject.validation")

const getSubjects = async () => {
    return await repository.getAllSubjects()
}

const createSubject = async (subjectData) => {
    const errors = validation.validateSubject(subjectData)

    if (errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    subjectData.descripcion = subjectData.descripcion || ''
    subjectData.status = true
    subjectData.createdAt = new Date()

    return await repository.createSubject(subjectData)
}

const getSubjectById = async (id) => {
    const subject = await repository.getSubjectById(id)

    if (!subject) {
        throw new Error("Materia no encontrada")
    }

    return subject
}

const updateSubject = async (id, subjectData) => {
    const subject = await repository.getSubjectById(id)

    if (!subject) {
        throw new Error("Materia no encontrada")
    }

    const errors = validation.validateSubject(subjectData)

    if (errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    subjectData.updatedAt = new Date()

    return await repository.updateSubject(id, subjectData)
}

const deleteSubject = async (id) => {
    const subject = await repository.getSubjectById(id)

    if (!subject) {
        throw new Error("Materia no encontrada")
    }

    return await repository.deleteSubject(id)
}

module.exports = {
    getSubjects,
    createSubject,
    getSubjectById,
    updateSubject,
    deleteSubject
}