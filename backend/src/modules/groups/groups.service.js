const repository = require("./groups.repository")
const validation = require("./groups.validation")
const { createAuditLog } = require('../../utils/audit.service')

// Obtener todos los grupos
const getGroups = async () => {
    return await repository.getAllGroups()
}

// Crear un grupo nuevo con validacion y registro de auditoria
const createGroup = async (groupData, adminId) => {
    // Validar los datos antes de guardar
    const errors = validation.validateGroup(groupData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    // Valores por defecto antes de guardar
    groupData.descripcion = groupData.descripcion || ''
    groupData.status      = true
    groupData.createdAt   = new Date()

    const saved = await repository.createGroup(groupData)

    // Registrar accion en auditoria
    await createAuditLog(adminId, 'CREATE_GROUP', {
        groupId:   saved.id,
        groupName: groupData.name || groupData.nombre,
        teacherId: groupData.teacherId
    })

    return saved
}

// Obtener un grupo por su id y valida si existe
const getGroupById = async (id) => {
    const group = await repository.getGroupById(id)
    if (!group) throw new Error("Grupo no encontrado")
    return group
}

// Obtener todos los grupos asignados a un docente
const getGroupsByTeacher = async (teacherId) => {
    return await repository.getGroupsByTeacher(teacherId)
}

// Actualizar un grupo con validacion y registro de auditoria
const updateGroup = async (id, groupData, adminId) => {
    // Verificar que el grupo existe antes de actualizar
    const group = await repository.getGroupById(id)
    if (!group) throw new Error("Grupo no encontrado")

    // Validar los datos enviados
    const errors = validation.validateGroup(groupData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    // Registrar fecha de actualizacion
    groupData.updatedAt = new Date()
    const result = await repository.updateGroup(id, groupData)

    // Registrar en auditoria
    await createAuditLog(adminId, 'UPDATE_GROUP', { groupId: id, updates: groupData })

    return result
}

// Baja logica de un grupo 
const deleteGroup = async (id, adminId) => {
    // Verificarque el grupo existe antes de dar de baja
    const group = await repository.getGroupById(id)
    if (!group) throw new Error("Grupo no encontrado")

    const result = await repository.deleteGroup(id)

    // Registrar cambio en auditoria
    await createAuditLog(adminId, 'DELETE_GROUP', {
        groupId:   id,
        groupName: group.name || group.nombre
    })

    return result
}

module.exports = {
    getGroups, createGroup, getGroupById,
    getGroupsByTeacher, updateGroup, deleteGroup
}