const service = require("./student.service")

const getStudents = async(req, res) => {
    try {
        const students = await service.getStudents()
        res.json({
            success: true,
            data: students
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getStudentsById = async(req, res) => {
    try {
        const student = await service.getStudentsById(req.params.id)

        res.json({
            success: true,
            data: student
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

const updateStudent = async(req, res) => {
    try {
        const response = await service.updateStudent(
            req.params.id,
            req.body
        )

        res.json({
            success: true,
            message: "Alumno actualizado",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const deleteStudent = async(req, res) => {
    try {
        const response = await service.deleteStudent(req.params.id)

        res.json({
            success: true,
            message: "Alumno dado de baja",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getStudents,
    getStudentsById,
    updateStudent,
    deleteStudent
}