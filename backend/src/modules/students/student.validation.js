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

    return errors;
}

module.exports = {
    validateStudent
}