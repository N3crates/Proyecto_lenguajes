const validateSubject = (subjectData) => {
    const errors = []

    // Nombre de la materia obligatorio
    if (!subjectData.nombre) {
        errors.push("El nombre es obligatorio")
    }

    // Clave de la materia obligatoria
    if (!subjectData.clave) {
        errors.push("La clave de la materia es obligatoria")
    }

    // Creditos obligatorios
    if (!subjectData.creditos) {
        errors.push("Los creditos son obligatorios")
    }

    // Semestre obligatorio
    if (!subjectData.semestre) {
        errors.push("El semestre es obligatorio")
    }

    // Retorna el array que es vacio si no hay errores
    return errors
}

module.exports = {
    validateSubject
}