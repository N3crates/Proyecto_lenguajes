const db = require("../../config/firebase")
const collection = db.collection("users")

const getAllStudents = async() => {
    const snapshot = await collection.where("role", "==", "student").get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const getStudentsById = async(id) => {
    const doc = await collection.doc(id).get()

    if(!doc.exists){
        return null
    }
    const student = {
        id: doc.id,
        ...doc.data()
    }
    if(!student.role !== "student") {
        return null
    }
    return student
}

const updateStudent = async(id, studentData) => {
    await collection.doc(id).update(studentData)
    return {id}
}

const deleteStudent = async(id) => {
    await collection.doc(id).update({
        status: false,
        deletedAt: new Date()
    })
    return{id}
}

module.exports = {
    getAllStudents,
    createStudent,
    getStudentsById,
    updateStudent,
    deleteStudent
}