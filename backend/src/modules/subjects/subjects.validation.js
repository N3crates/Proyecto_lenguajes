const validateSubject = (subjectData) => {
    const errors = []

    if (!subjectData.nombre) {
        errors.push("El nombre es obligatorio")
    }

    if (!subjectData.clave) {
        errors.push("La clave de la materia es obligatoria")
    }

    if (!subjectData.creditos) {
        errors.push("Los créditos son obligatorios")
    }

    if (!subjectData.semestre) {
        errors.push("El semestre es obligatorio")
    }

    return errors
}

module.exports = {
    validateSubject
}