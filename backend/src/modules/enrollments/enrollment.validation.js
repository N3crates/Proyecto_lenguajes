const validateEnrollment = (enrollmentData) => {
    const errors = []

    if(!enrollmentData.studentId) {
        errors.push("El id es obligatorio")
    }
    if(!enrollmentData.subject) {
        errors.push("La materia es obligatoria")
    }
    if(!enrollmentData.teacher) {
        errors.push("El docente es obligatorio")
    }
    if(!enrollmentData.semester) {
        errors.push("El semestre es obligatorio")
    }
    if(!enrollmentData.group) {
        errors.push("El grupo es obligatorio")
    }
    return errors
}

module.exports = {
    validateEnrollment
}