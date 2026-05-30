const db = require("../../config/firebase")
const collection = db.collection("grades")

const getAllGrades = async() => {
    const snapshot = await collection.get()

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const createGrade = async(gradeData) => {
    const response = await collection.add(gradeData)

    return { id: response.id }
}

const getGradesByEnrollmentId = async (enrollmentId) => {
    const snapshot = await collection.where("enrollmentId", "==", enrollmentId).where("status", "==", true).get()
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
}

const findByEnrollmentId = async (enrollmentId) => {
    const snapshot = await collection.where("enrollmentId", "==", enrollmentId).where("status", "==", true).get()
    if(snapshot.empty){
        return null
    }

    const doc = snapshot.docs[0]
    return {
        id: doc.id,
        ...doc.data()
    }
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

const deleteGradesByEnrollmentId = async (enrollmentId) => {

    const snapshot = await collection
        .where("enrollmentId", "==", enrollmentId)
        .where("status", "==", true)
        .get();

    await Promise.all(
        snapshot.docs.map(doc =>
            doc.ref.update({
                status: false,
                deletedAt: new Date()
            })
        )
    );

};

module.exports = {
    getAllGrades,
    createGrade,
    getGradesByEnrollmentId,
    findByEnrollmentId,
    updateGrade,
    deleteGrade,
    deleteGradesByEnrollmentId
}