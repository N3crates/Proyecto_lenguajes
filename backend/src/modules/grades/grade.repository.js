const db = require("../../config/firebase")
const collection = db.collection("grades")

const getAllGrades = async() => {
    const snapshot = await collection.where("status", "==", true).get()

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const createGrade = async(gradeData) => {
    const response = await collection.add(gradeData)

    return { id: response.id }
}

const getGradesByEnrollmentId = async(enrollmentId) => {
    const snapshot = await collection
        .where("enrollmentId", "==", enrollmentId)
        .where("status", "==", true)
        .get()
    
    return snapshot.docs.map(docs => ({
        id: doc.id,
        ...doc.data()
    }))
}

const updateGrade = async(id, gradeData) => {
    await collection.doc(id).update(gradeData)
    return{ id }
}

const deleteGrade = async(id) => {
    await collection.doc(id).update({
        status: false,
        deleteAt: new Date()
    })
    return{ id }
}

module.exports = {
    getAllGrades,
    createGrade,
    getGradesByEnrollmentId,
    updateGrade,
    deleteGrade
}