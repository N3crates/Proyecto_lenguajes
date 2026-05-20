import { useEffect, useState } from "react";
import { getEnrollments, createEnrollment, updateEnrollment, deleteEnrollment } from "../services/enrollmentService";
import "../styles/Teachers.css"
import { useNavigate } from "react-router-dom";

function Enrollments() {
    const navigate = useNavigate()
    const [enrollments, setEnrollments] = useState([])
    const [showForm, setshowForm] = useState(false)
    const [editingEnrollmentId, setEditingEnrollmentId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({studentId: "", subjectId: "", groupId: "", enrollmentData: ""})
    
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

    useEffect(() => {loadEnrollments()}, [])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleEdit = (enrollment) => {
        setshowForm(true)
        setEditingEnrollmentId(enrollment.id)
        setFormData({studentId: enrollment.studentId || "", subjectId: enrollment.subjectId || "", groupId: enrollment.groupId || "", enrollmentData: enrollment.enrollmentData || ""})
    }
    
    const handleDelete = async(id) => {
        const confirmDelete = window.confirm("¿Desea dar de baja esta inscripción?")
        if(!confirmDelete) return
        try {
            await deleteEnrollment(id)
            setEnrollments(prevEnrollmets => prevEnrollmets.map(enrollment => enrollment.id === id ? {...enrollment, status: false} : enrollment))
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            if(editingEnrollmentId){
                await updateEnrollment(editingEnrollmentId, formData)
            }else{
                await createEnrollment(formData)}
                await loadEnrollments()
                setFormData({studentId: "", subjectId: "", groupId: "", enrollmentData: ""})
                setEditingEnrollmentId(null)
                setshowForm(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setshowForm(false)
        setFormData({studentId: "", subjectId: "", groupId: "", enrollmentData: ""})
    }

    return(
        <div className="module-page">
            {/* HEADER */}
            <div className="module-header">
                <h1 className="module-title">Gestión de Inscripciones 🗂️</h1>
                <p className="module-subtitle">Administra y visualiza las Inscripciones registradas</p>
                <button className="auth-button" onClick={() => navigate("/dashboard")}>Regresar</button>
                <button className="auth-button" onClick={() => setshowForm(!showForm)} onSubmit={handleSubmit}>+ Nueva Inscripción</button>
            </div>
            {/*Formulario*/}
            {showForm && (
                <div className="module-form-card">
                    <h5 className="module-form-title">{editingEnrollmentId ? "Editar inscripcion" : "Nuevo Estudiante"}</h5>
                    <from className="module-form-group">
                        <div className="module-form-group">
                            <label className="module-label">ID Alumno</label>
                            <input type="text" className="module-input" name="studentId" value={formData.studentId} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">ID Materia</label>
                            <input type="text" className="module-input" name="subjectId" value={formData.subjectId} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">ID Grupo</label>
                            <input type="text" className="module-input" name="groupId" value={formData.groupId} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">Fecha</label>
                            <input type="text" className="module-input" name="enrollmentData" value={formData.enrollmentData} onChange={handleChange} />
                        </div>
                        <div className="module-form-actions">
                            <button type="submit" className="module-btn-save">{editingEnrollmentId ? "Actualizar Inscripcion" : "Guardar Alumno"}</button>
                            <button className="module-btn-cancel" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </from>
                </div>
            )}
            {/*Tabla*/}
            {loading ? (<p className="module-loading">Cargando...</p>) : (
                <div className="module-table-card">
                    <table className="module-table">
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>Materia</th>
                                <th>Grupo</th>
                                <th>Fecha</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        {/* ENROLLMENTS */}
                        <tbody>
                            {enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="module-empty">No hay Inscripciones registradas</td>
                                </tr>
                            ) : (
                                enrollments.map(enrollment => (
                                    <tr key={enrollment.id}>
                                        <td>{enrollment.studentId}</td>
                                        <td>{enrollment.subjectId}</td>
                                        <td>{enrollment.groupId}</td>
                                        <td>{enrollment.enrollmentData}</td>
                                        <td>
                                            <span className={enrollment.status ? "badge-active" : "badge-inactive"}>
                                                {enrollment.status ? "😎Activo" : "😓Baja"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="module-actions">
                                                <button className="module-btn-edit" onClick={() => handleEdit(enrollment)}>✏️Editar</button>
                                                <button className="module-btn-delete" onClick={() => handleDelete(enrollment.id)}>❌Baja</button>
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

export default Enrollments