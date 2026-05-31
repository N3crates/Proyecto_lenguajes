const db = require("../../config/firebase")
const collection = db.collection("subjects")

// Obtener todas las materias de la coleccion
const getAllSubjects = async () => {
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

// Crear un nuevo documento en la coleccion subjects
const createSubject = async (subjectData) => {
    const response = await collection.add(subjectData)
    return {
        id: response.id
    }
}

// Obtener una materia por su id de documento
const getSubjectById = async (id) => {
    const doc = await collection.doc(id).get()

    if (!doc.exists) {
        return null
    }

    return {
        id: doc.id,
        ...doc.data()
    }
}

// Buscar una materia por su clave para evitar duplicados
const getSubjectByClave = async (clave) => {
    const snapshot = await collection.where("clave", "==", clave).limit(1).get()
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() }
}

// Actualizar los campos de una materia por su id
const updateSubject = async (id, subjectData) => {
    await collection.doc(id).update(subjectData)
    return { id }
}

// Baja logica, cambia status a false y registra la fecha de baja
const deleteSubject = async (id) => {
    await collection.doc(id).update({
        status: false,
        deletedAt: new Date()
    })
    return { id }
}

module.exports = {
    getAllSubjects,
    createSubject,
    getSubjectById,
    getSubjectByClave,
    updateSubject,
    deleteSubject
}