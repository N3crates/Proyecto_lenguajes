import { useEffect, useState } from "react";
import { getGrades, createGrades, updateGrades, deleteGrade } from "../services/gradeService";
import "../styles/Teachers.css";
import { useNavigate } from "react-router-dom";
import { getEnrollments } from "../services/enrollmentService";

function Grades() {
    const navigate = useNavigate()
    const [grades, setGrades] = useState([])
    const [enrollments, setEnrollments] = useState([])
    const [showForm, setshowForm] = useState(false)
    const [editingGradeId, setEditingGradeId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({ enrollmentId: "", partial1: "", partial2: "", partial3: ""})

    const loadGrades = async() => {
        try {
            const response = await getGrades()
            setGrades(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const loadEnrollments = async() => {
        try {
            const response = await getEnrollments()
            setEnrollments(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {loadGrades(); loadEnrollments();}, [])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleEdit = (grade) => {
        setshowForm(true)
        setEditingGradeId(grade.id)
        setFormData({studentId: grade.enrollmentId || "", partial1: grade.partial1 || "", partial2: grade.partial2 || "", partial3: grade.partial3})
    }

    const handleDelete = async(id) => {
        const confirmDelete = window.confirm("¿Desea dar de baja esta inscripcion?")
        if(!confirmDelete) return
        try {
            await deleteGrade(id)
            setGrades(prevGrades => prevGrades.map(grade => grade.id === id ? {...grade, status: false} : grade))
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            if(editingGradeId){
                await updateGrades(editingGradeId, formData)
            }else{
                await createGrades(formData)}
                await loadGrades()
                setFormData({enrollmentId: "", partial1: "", partial2: "", partial3: ""})
                setEditingGradeId(null)
                setshowForm(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setshowForm(false)
        setFormData({enrollmentId: "", partial1: "", partial2: "", partial3: ""})
    }

    return(
        <div className="module-page">
            {/* HEADER */}
            <div className="module-header">
                <h1 className="module-title">Gestión de Calificaciones 📜</h1>
                <p className="module-subtitle">Administra y visualiza las calificaciones registradas</p>
                <button className="auth-button" onClick={() => navigate("/dashboard")}>Regresar</button>
                <button className="auth-button" onClick={() => setshowForm(!showForm)} onSubmit={handleSubmit}>+ Nueva Calificación</button>
            </div>
            {/*Formulario*/}
            {showForm && (
                <div className="module-form-card">
                    <h5 className="module-form-title">{editingGradeId ? "Editar inscripcion" : "Nuevo Estudiante"}</h5>
                    <form className="module-form-group">
                        <div className="module-form-group">
                            <label className="module-label">Inscripción</label>
                            <select className="module-input" name="enrollmentId" value={formData.enrollmentId} onChange={handleChange}>
                                <option value="">Selecciona inscripcion</option>
                                {enrollments.map(enrollment => (
                                    <option key={enrollment.id} value={enrollment.id}>
                                        {enrollment.studentId} {"-"} {enrollment.subjectId}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">Parcial1</label>
                            <input type="text" className="module-input" name="partial1" value={formData.partial1} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">partial2</label>
                            <input type="text" className="module-input" name="partial2" value={formData.partial2} onChange={handleChange} />
                        </div>
                          <div className="module-form-group">
                            <label className="module-label">partial3</label>
                            <input type="text" className="module-input" name="partial3" value={formData.partial3} onChange={handleChange} />
                        </div>
                        <div className="module-form-actions">
                            <button type="submit" className="module-btn-save">{editingGradeId ? "Actualizar Inscripcion" : "Guardar Alumno"}</button>
                            <button className="module-btn-cancel" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
            {/*Tabla*/}
            {loading ? (<p className="module-loading">Cargando...</p>) : (
                <div className="module-table-card">
                    <table className="module-table">
                        <thead>
                            <tr>
                                <th>Inscripcion</th>
                                <th>Parcial_1</th>
                                <th>Parcial_2</th>
                                <th>Parcial_3</th>
                                <th>Promedio</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        {/* ENROLLMENTS */}
                        <tbody>
                            {grades.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="module-empty">No hay Calificaciones registradas</td>
                                </tr>
                            ) : (
                                grades.map(grade => (
                                    <tr key={grade.id}>
                                        <td>{enrollments.find(enrollment => enrollment.id === grade.enrollmentId) ? 
                                            `${enrollments.find(enrollment.id === grade.enrollmentId).studentId} - ${enrollments.find(
                                                enrollment => enrollment.id === grade.enrollmentId).subjectId}`: "Sin inscripcion"
                                            }</td>
                                        <td>{grade.partial1}</td>
                                        <td>{grade.partial2}</td>
                                        <td>{grade.partial3}</td>
                                        <td>
                                            {((Number(grade.partial1 || 0)+Number(grade.partial2 || 0)+Number(grade.partial3 || 0))/3).toFixed(1)}
                                        </td>
                                        <td>
                                            <span className={grade.status ? "badge-active" : "badge-inactive"}>
                                                {grade.status ? "😎Activo" : "😓Baja"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="module-actions">
                                                <button className="module-btn-edit" onClick={() => handleEdit(grade)}>✏️Editar</button>
                                                <button className="module-btn-delete" onClick={() => handleDelete(grade.id)}>❌Baja</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Grades