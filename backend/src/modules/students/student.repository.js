const db = require("../../config/firebase")
const collection = db.collection("students")
const getAllStudents = async() => {
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const createStudent = async(studentData) => {
    const response = await collection.add(studentData)
    return {
        id: response.id
    }
}

module.exports = {
    getAllStudents,
    createStudent
}