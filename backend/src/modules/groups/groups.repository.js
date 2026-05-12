const db = require("../../config/firebase")
const collection = db.collection("groups")

const getAllGroups = async () => {
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const createGroup = async (groupData) => {
    const response = await collection.add(groupData)
    return {
        id: response.id
    }
}

const getGroupById = async (id) => {
    const doc = await collection.doc(id).get()

    if (!doc.exists) {
        return null
    }

    return {
        id: doc.id,
        ...doc.data()
    }
}

const getGroupsByTeacher = async (teacherId) => {
    const snapshot = await collection
        .where("teacherId", "==", teacherId)
        .get()

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const updateGroup = async (id, groupData) => {
    await collection.doc(id).update(groupData)
    return { id }
}

const deleteGroup = async (id) => {
    await collection.doc(id).update({
        status: false,
        deletedAt: new Date()
    })
    return { id }
}

module.exports = {
    getAllGroups,
    createGroup,
    getGroupById,
    getGroupsByTeacher,
    updateGroup,
    deleteGroup
}