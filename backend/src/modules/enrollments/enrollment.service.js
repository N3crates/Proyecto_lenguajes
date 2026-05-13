const repository = require("./enrollment.repository")
const validation = require("./enrollment.validation")

const getEnrollments = async() => {
    return await repository.getAllEnrollments()
}

const createEnrollment = async(enrollmentData) => {
    const errors= validation.validateEnrollment(enrollmentData)

    if(errors.length > 0) {
        throw new Error(errors.join(", "))
    }

    const duplicate = await repository.findDuplicateEnrollment(
        enrollmentData.studentId, enrollmentData.subject, enrollmentData.group)
    
        if(duplicate) {
            throw new Error("El alumno ya esta inscrito en esta materia y grupo")
        }

    enrollmentData.status = true
    enrollmentData.createdAt = new Date()

    return await repository.createEnrollment(enrollmentData)
}

const getEnrollmentById = async(id) => {
    const enrollment = await repository.getEnrollmentById(id)

    if(!enrollment) {
        throw new Error("Inscripcion no encontrada")
    }
    return enrollment
}

const getEnrollmentByStudentId = async(studentId) => {
    return await repository.getEnrollmentByStudentId(studentId)
}

const deleteEnrollment = async(id) => {
    const enrollment = await repository.getEnrollmentById(id)

    if(!enrollment) {
        throw new Error("Inscripción no encontrada")
    }
    return await repository.deleteEnrollment(id)
}

const updateEnrollment = async(id, enrollmentData) => {
    const enrollment = await repository.getEnrollmentById(id)

    if(!enrollment) {
        throw new Error("Inscripción no encontrada")
    }

    const errors = validation.validateEnrollment(enrollmentData)

    if(errors.length > 0){
        throw new Error(errors.join(", "))
    }

    const duplicate = await repository.findDuplicateEnrollment(
        enrollmentData.studentId, enrollmentData.subject, enrollmentData.group)
    
        if(duplicate && (enrollment.studentId !== enrollmentData.studentId
            || enrollmentData.subject !== enrollmentData.subject
            || enrollmentData.group !== enrollmentData.group)) {
                throw new Error ("Ys existe una inscripción")
            }
        
        enrollmentData.updatedAt = new Date()
        
        return await repository.updateEnrollment(id, enrollmentData) 
}

module.exports = {
    getEnrollments,
    createEnrollment,
    getEnrollmentById,
    getEnrollmentByStudentId,
    deleteEnrollment,
    updateEnrollment
}