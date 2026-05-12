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

const createStudent = async(req, res) => {
    try {
        const response = await service.createStudent(req.body)
        res.status(201).json({
            success: true,
            message: "Alumno Creado",
            data: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getStudents,
    createStudent
}