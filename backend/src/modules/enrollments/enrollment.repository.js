const db = require("../../config/firebase")
const collection = db.collection("enrollments")

const getAllEnrollments = async() => {
    const snapshot = await collection.where("status", "==", true).get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const createEnrollment = async(enrollmentData) => {
    const response = await collection.add(enrollmentData)
    return{ id: response.id }
}

const getEnrollmentById = async(id) => {
    const doc = await collection.doc(id).get()

    if(!doc.exists){
        return null
    }
    
    const enrollment = {
        id: doc.id,
        ...doc.data()
    }

    if(!enrollment.status) {
        return null
    }

    return enrollment
}

const getEnrollmentByStudentId = async(studentId) => {
    const snapshot = await collection
        .where("studentId", "==", studentId)
        .where("status", "==", true)
        .get()
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const deleteEnrollment = async(id) => {
    await collection.doc(id).update({
        status: false,
        deleteAt: new Date() 
    })

    return { id }
}

const findDuplicateEnrollment = async(studentId, subject, group) => {
    const snapshot = await collection
        .where("studentId", "==", studentId)
        .where("subject", "==", subject)
        .where("group", "==", group)
        .where("status", "==", true)
        .get()
    
    return !snapshot.empty
}

const updateEnrollment = async(id, enrollmentData) => {
    await collection.doc(id).update(enrollmentData)
    return { id }
}

module.exports = {
    getAllEnrollments,
    createEnrollment,
    getEnrollmentById,
    getEnrollmentByStudentId,
    deleteEnrollment,
    findDuplicateEnrollment,
    updateEnrollment
}