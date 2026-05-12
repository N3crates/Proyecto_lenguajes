const repository = require("./student.repository")
const getStudents = async () => {
    return await repository.getAllStudents()
}

const createStudent = async (studentData) => {
    studentData.status = true
    studentData.createAt = new Date()
    return await repository.createStudent(studentData)
}

module.exports = {
    getStudents,
    createStudent
}