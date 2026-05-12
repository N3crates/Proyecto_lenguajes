const repository = require("./group.repository")
const validation = require("./group.validation")

const getGroups = async () => {
    return await repository.getAllGroups()
}

const createGroup = async (groupData) => {
    const errors = validation.validateGroup(groupData)

    if (errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    groupData.descripcion = groupData.descripcion || ''
    groupData.status = true
    groupData.createdAt = new Date()

    return await repository.createGroup(groupData)
}

const getGroupById = async (id) => {
    const group = await repository.getGroupById(id)

    if (!group) {
        throw new Error("Grupo no encontrado")
    }

    return group
}

const getGroupsByTeacher = async (teacherId) => {
    const groups = await repository.getGroupsByTeacher(teacherId)
    return groups
}

const updateGroup = async (id, groupData) => {
    const group = await repository.getGroupById(id)

    if (!group) {
        throw new Error("Grupo no encontrado")
    }

    const errors = validation.validateGroup(groupData)

    if (errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    groupData.updatedAt = new Date()

    return await repository.updateGroup(id, groupData)
}

const deleteGroup = async (id) => {
    const group = await repository.getGroupById(id)

    if (!group) {
        throw new Error("Grupo no encontrado")
    }

    return await repository.deleteGroup(id)
}

module.exports = {
    getGroups,
    createGroup,
    getGroupById,
    getGroupsByTeacher,
    updateGroup,
    deleteGroup
}