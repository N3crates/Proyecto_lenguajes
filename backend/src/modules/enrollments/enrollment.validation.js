const validateEnrollment = (enrollmentData) => {
    const errors = []
    if(!enrollmentData.studentId) {
        errors.push("El alumno es obligatorio")
    }

    if(!enrollmentData.groupId) {
        errors.push("El grupo es obligatorio")
    }

    if(!enrollmentData.subjectId) {
        errors.push("La materia es obligatoria")
    }

    if(!enrollmentData.semester) {
        errors.push("El semestre es obligatorio")
    }

    if(!enrollmentData.enrollmentDate) {
        errors.push("La fecha es obligatoria")
    }
    return errors
}

module.exports = {
    validateEnrollment
}