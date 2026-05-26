const repository = require("./groups.repository")
const validation = require("./groups.validation")
const { createAuditLog } = require('../../utils/audit.service')

const getGroups = async () => {
    return await repository.getAllGroups()
}

const createGroup = async (groupData, adminId) => {
    const errors = validation.validateGroup(groupData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    groupData.descripcion = groupData.descripcion || ''
    groupData.status      = true
    groupData.createdAt   = new Date()

    const saved = await repository.createGroup(groupData)

    await createAuditLog(adminId, 'CREATE_GROUP', {
        groupId:   saved.id,
        groupName: groupData.name || groupData.nombre,
        teacherId: groupData.teacherId
    })

    return saved
}

const getGroupById = async (id) => {
    const group = await repository.getGroupById(id)
    if (!group) throw new Error("Grupo no encontrado")
    return group
}

const getGroupsByTeacher = async (teacherId) => {
    return await repository.getGroupsByTeacher(teacherId)
}

const updateGroup = async (id, groupData, adminId) => {
    const group = await repository.getGroupById(id)
    if (!group) throw new Error("Grupo no encontrado")

    const errors = validation.validateGroup(groupData)
    if (errors.length > 0) throw new Error(errors.join(", "))

    groupData.updatedAt = new Date()
    const result = await repository.updateGroup(id, groupData)

    await createAuditLog(adminId, 'UPDATE_GROUP', { groupId: id, updates: groupData })

    return result
}

const deleteGroup = async (id, adminId) => {
    const group = await repository.getGroupById(id)
    if (!group) throw new Error("Grupo no encontrado")

    const result = await repository.deleteGroup(id)

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