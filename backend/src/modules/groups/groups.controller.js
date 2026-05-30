// Controlador de grupos — recibe las peticiones HTTP y llama al service

const service = require("./groups.service")

// Obtener todos los grupos
const getGroups = async (req, res) => {
    try {
        const groups = await service.getGroups()
        res.json({
            success: true,
            data: groups
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Crear un nuevo grupo
const createGroup = async (req, res) => {
    try {
        const response = await service.createGroup(req.body)
        res.status(201).json({
            success: true,
            message: "Grupo creado",
            data: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Obtener un grupo por su id
const getGroupById = async (req, res) => {
    try {
        const group = await service.getGroupById(req.params.id)
        res.json({
            success: true,
            data: group
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Obtener todos los grupos asignados a un docente por su teacherId
const getGroupsByTeacher = async (req, res) => {
    try {
        const groups = await service.getGroupsByTeacher(req.params.teacherId)
        res.json({
            success: true,
            data: groups
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Actualizar los datos de un grupo por su id
const updateGroup = async (req, res) => {
    try {
        const response = await service.updateGroup(req.params.id, req.body)
        res.json({
            success: true,
            message: "Grupo actualizado",
            data: response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Baja logica de un grupo por su id
const deleteGroup = async (req, res) => {
    try {
        const response = await service.deleteGroup(req.params.id)
        res.json({
            success: true,
            message: "Grupo dado de baja",
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
    getGroups,
    createGroup,
    getGroupById,
    getGroupsByTeacher,
    updateGroup,
    deleteGroup
}