const validateGroup = (groupData) => {
    const errors = []

    // Nombre del grupo obligatorio
    if (!groupData.nombre) {
        errors.push("El nombre del grupo es obligatorio")
    }

    // Docente obligatorio
    if (!groupData.teacherId) {
        errors.push("El docente es obligatorio")
    }

    // Materia obligatoria
    if (!groupData.subjectId) {
        errors.push("La materia es obligatoria")
    }

    // Ciclo escolar obligatorio
    if (!groupData.ciclo) {
        errors.push("El ciclo escolar es obligatorio")
    }

    // Retorna el arreglo, vacio si no hay errores
    return errors
}

module.exports = {
    validateGroup
}