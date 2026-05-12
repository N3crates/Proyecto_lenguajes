const repository = require("./teacher.repository")
const validation = require("./teacher.validation")

const getTeachers = async () => {
    return await repository.getAllTeachers()
}

const createTeacher = async (teacherData) => {
    const errors = validation.validateTeacher(teacherData)

    if (errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    teacherData.amaterno = teacherData.amaterno || ''
    teacherData.ciudad = teacherData.ciudad || ''
    teacherData.status = true
    teacherData.createdAt = new Date()

    return await repository.createTeacher(teacherData)
}

const getTeacherById = async (id) => {
    const teacher = await repository.getTeacherById(id)

    if (!teacher) {
        throw new Error("Docente no encontrado")
    }

    return teacher
}

const updateTeacher = async (id, teacherData) => {
    const teacher = await repository.getTeacherById(id)

    if (!teacher) {
        throw new Error("Docente no encontrado")
    }

    const errors = validation.validateTeacher(teacherData)

    if (errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    teacherData.updatedAt = new Date()

    return await repository.updateTeacher(id, teacherData)
}

const deleteTeacher = async (id) => {
    const teacher = await repository.getTeacherById(id)

    if (!teacher) {
        throw new Error("Docente no encontrado")
    }

    return await repository.deleteTeacher(id)
}

module.exports = {
    getTeachers,
    createTeacher,
    getTeacherById,
    updateTeacher,
    deleteTeacher
}