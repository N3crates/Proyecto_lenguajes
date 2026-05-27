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
    if(student.role !== "student") {
        return null
    }
    return student
}

const updateStudent = async(id, studentData) => {
    await collection.doc(id).update(studentData)
    return {id}
}

const deleteStudent = async(id) => {
    const doc = await collection.doc(id).get()
    if(!doc.exists){
        return null
    }

    const student = doc.data()

    await collection.doc(id).update({
        status: !student.status,
        updateAt: new Date()
    })
    return{id}
}

module.exports = {
    getAllStudents,
    getStudentsById,
    updateStudent,
    deleteStudent
}