const repository = require("./student.repository")
const validation = require("./student.validation")

const getStudents = async () => {
    return await repository.getAllStudents()
}

const createStudent = async (studentData) => {
    const errors = validation.validateStudent(studentData)

    if(errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    studentData.status = true
    studentData.createdAt = new Date()
    return await repository.createStudent(studentData)
}

const getStudentsById = async(id) => {
    const student = await repository.getStudentsById(id)

    if(!student){
        throw new Error("Alumno no encontrado")
    }
    return student
}

const updateStudent = async(id, studentData) => {
    const student = await repository.getStudentsById(id)

    if(!student) {
        throw new Error("Alumno no encontrado")
    }

    const errors = validation.validateStudent(studentData)

    if(errors.length > 0) {
        throw new Error(errors.join(", "))
    }
    studentData.updatedAt = new Date()
    return await repository.updateStudent(id, studentData)
}

const deleteStudent = async(id) => {
    const student = await repository.getStudentsById(id)

    if(!student){
        throw new Error("Alumno no encontrado")
    }
    return await repository.deleteStudent(id)
}

module.exports = {
    getStudents,
    createStudent,
    getStudentsById,
    updateStudent,
    deleteStudent
}