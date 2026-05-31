const validateGrade = (gradeData) => {
    const errors = []

    if(!gradeData.enrollmentId){
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
    if (gradeData.partial1 < 0 || gradeData.partial1 > 10
    ) {
    errors.push(
        "Parcial 1 debe estar entre 0 y 10"
    )
    }
    if (gradeData.partial2 < 0 || gradeData.partial2 > 10
    ) {
    errors.push(
        "Parcial 2 debe estar entre 0 y 10"
    )
    }
    if (gradeData.partial3 < 0 || gradeData.partial3 > 10
    ) {
    errors.push(
        "Parcial 3 debe estar entre 0 y 10"
    )
    }
    return errors
}

module.exports = {
    validateGrade
}
