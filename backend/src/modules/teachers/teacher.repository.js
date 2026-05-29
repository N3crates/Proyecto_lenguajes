const db = require("../../config/firebase")
const collection = db.collection("teachers")

// Obtener todos los docentes
const getAllTeachers = async () => {
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

// Crear un nuevo documento en la coleccion teachers
const createTeacher = async (teacherData) => {
    const response = await collection.add(teacherData)
    return {
        id: response.id
    }
}

// Obtener un docente por su id de documento
const getTeacherById = async (id) => {
    const doc = await collection.doc(id).get()

    if (!doc.exists) {
        return null
    }

    return {
        id: doc.id,
        ...doc.data()
    }
}

// Actualizar los campos de un docente por su id
const updateTeacher = async (id, teacherData) => {
    await collection.doc(id).update(teacherData)
    return { id }
}

// Baja de docente cambia status a false y registra la fecha de baja
const deleteTeacher = async (id) => {
    await collection.doc(id).update({
        status: false,
        deletedAt: new Date()
    })
    return { id }
}

// Obtener un docente por el userId del usuario logueado
const getTeacherByUserId = async (userId) => {
    const snapshot = await collection.where("userId", "==", userId).limit(1).get()
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
}

module.exports = {
    getAllTeachers,
    createTeacher,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getTeacherByUserId
}