// Repositorio de grupos — acceso directo a Firestore

const db = require("../../config/firebase")
const collection = db.collection("groups")

// Obtener todos los grupos de la coleccion
const getAllGroups = async () => {
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

// Crear un nuevo documento en la coleccion groups
const createGroup = async (groupData) => {
    const response = await collection.add(groupData)
    return {
        id: response.id
    }
}

// Obtener un grupo por su id de documento
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

// Obtener todos los grupos donde el teacherId coincida
const getGroupsByTeacher = async (teacherId) => {
    const snapshot = await collection
        .where("teacherId", "==", teacherId)
        .get()

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

// Actualizar los campos de un grupo por su id
const updateGroup = async (id, groupData) => {
    await collection.doc(id).update(groupData)
    return { id }
}

// Baja logica — cambia status a false y registra la fecha de baja
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