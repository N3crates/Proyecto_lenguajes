const validateTeacher = (teacherData) => {
    const errors = []

    if (!teacherData.nombre) {
        errors.push("El nombre es obligatorio")
    }

    if (!teacherData.apaterno) {
        errors.push("El apellido paterno es obligatorio")
    }

    if (!teacherData.email) {
        errors.push("El email es obligatorio")
    }

    if (!teacherData.telefono) {
        errors.push("El teléfono es obligatorio")
    }

    if (!teacherData.especialidad) {
        errors.push("La especialidad es obligatoria")
    }

    return errors
}

module.exports = {
    validateTeacher
}