const validateGrade = (gradeData) => {
    const errors = []

    if(!gradeDate.enrollmentId){
        errors.push("El enrollmentId es obligatorio")
    }
    if(gradeData.partial1 == null){
        errors.push("Parcial 1 obligatorio")
    }
    if(gradeData.partial2 == null){
        errors.push("Parcial 2 obligatorio")
    }
    if(gradeData.partial3 == null){
        errors.push("Parcial 3 obligatorio")
    }

    return errors
}

module.exports = {
    validateGrade
}
