const db = require("../../config/firebase")
const usersCollection = db.collection("users")
const studentsCollection = db.collection("students")

const getAllStudents = async() => {
    const snapshot = await studentsCollection.get()
    return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id:            doc.id,
            name:          `${data.nombre} ${data.apaterno} ${data.amaterno}`.trim(),
            email:         data.email,
            studentNumber: data.studentNumber,
            carrera:       data.carrera,
            semestre:      data.semestre,
            role:          "student",
            status:        data.status,
            userId:        data.userId,
        }
    })
}

const getStudentsById = async(id) => {
    const doc = await studentsCollection.doc(id).get()
    if (!doc.exists) return null

    const data = doc.data()
    return {
        id:            doc.id,
        name:          `${data.nombre} ${data.apaterno} ${data.amaterno}`.trim(),
        email:         data.email,
        studentNumber: data.studentNumber,
        carrera:       data.carrera,
        semestre:      data.semestre,
        role:          "student",
        status:        data.status,
        userId:        data.userId,
    }
}

const updateStudent = async(id, studentData) => {
    const { name, email, ...rest } = studentData

    let updatePayload = { ...rest }

    // Si viene name completo lo dividimos para mantener consistencia en Firestore
    if (name) {
        const parts = name.trim().split(" ")
        updatePayload.nombre   = parts[0] || ""
        updatePayload.apaterno = parts[1] || ""
        updatePayload.amaterno = parts.slice(2).join(" ") || ""
    }

    await studentsCollection.doc(id).update({
        ...updatePayload,
        updatedAt: new Date()
    })
    return { id }
}

const deleteStudent = async(id) => {
    const doc = await studentsCollection.doc(id).get()
    if (!doc.exists) return null

    const student = doc.data()
    await studentsCollection.doc(id).update({
        status: !student.status,
        updatedAt: new Date()  // también corregí el typo "updateAt" → "updatedAt"
    })
    return { id }
}

module.exports = {
    getAllStudents,
    getStudentsById,
    updateStudent,
    deleteStudent
}