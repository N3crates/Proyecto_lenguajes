const validateGroup = (groupData) => {
    const errors = []

    if (!groupData.nombre) {
        errors.push("El nombre del grupo es obligatorio")
    }

    if (!groupData.teacherId) {
        errors.push("El docente es obligatorio")
    }

    if (!groupData.subjectId) {
        errors.push("La materia es obligatoria")
    }

    if (!groupData.ciclo) {
        errors.push("El ciclo escolar es obligatorio")
    }

    return errors
}

module.exports = {
    validateGroup
}