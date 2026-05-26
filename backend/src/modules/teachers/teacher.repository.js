const db = require("../../config/firebase")
const collection = db.collection("teachers")

const getAllTeachers = async () => {
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const createTeacher = async (teacherData) => {
    const response = await collection.add(teacherData)
    return {
        id: response.id
    }
}

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

const updateTeacher = async (id, teacherData) => {
    await collection.doc(id).update(teacherData)
    return { id }
}

const deleteTeacher = async (id) => {
    await collection.doc(id).update({
        status: false,
        deletedAt: new Date()
    })
    return { id }
}

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