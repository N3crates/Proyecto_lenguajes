const db = require("../../config/firebase")
const collection = db.collection("subjects")

const getAllSubjects = async () => {
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const createSubject = async (subjectData) => {
    const response = await collection.add(subjectData)
    return {
        id: response.id
    }
}

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

const updateSubject = async (id, subjectData) => {
    await collection.doc(id).update(subjectData)
    return { id }
}

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
    updateSubject,
    deleteSubject
}