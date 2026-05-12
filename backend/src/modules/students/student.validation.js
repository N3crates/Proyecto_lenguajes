const validateStudent = (studentData) => {
    const errors = []

    if(!studentData.name){
        errors.push("El nombre es obligatorio")
    }
    
    if(!studentData.email){
        errors.push("El email es obligatorio")
    }

    if(!studentData.studentNumber){
        errors.push("La matricula es obligatorio")
    }

    if(!studentData.career){
        errors.push("La carrera es obligatorio")
    }

    if(!studentData.semester){
        errors.push("El semestre es obligatorio")
    }

    return errors;
}

module.exports = {
    validateStudent
}