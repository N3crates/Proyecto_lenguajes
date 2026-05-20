import { useEffect, useState } from "react";
import { getStudents, createStudent, updateStudent, deleteStudent } from "../services/studentService";
import "../styles/Teachers.css";
import { useNavigate } from "react-router-dom";

function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [showForm, setshowForm] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: "", email: "", studentNumber: "", career: "", semester: "" })
  
  const loadStudents = async() => {
    try {
        const response = await getStudents()
        setStudents(response.data)
        setLoading(false)
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
  }

  useEffect(() => {loadStudents()}, [])

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
  }

  const handleEdit = (student) => {
    setshowForm(true)
    setEditingStudentId(student.id)
    setFormData({name: student.name || "", email: student.email || "", studentNumber: student.studentNumber || "", career: student.career || "", semester: student.semester || ""})
  }

  const handleDelete = async(id) => {
    const confirmDelete = window.confirm("¿Deseas dar de baja este alumno?")
    if(!confirmDelete) return
    try {
        await deleteStudent(id)
        setStudents(prevStudents => prevStudents.map(student => student.id === id ? {...student, status: false} : student))
    } catch (error) {
        console.error(error)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
        if(editingStudentId){
            await updateStudent(editingStudentId, formData)
        }else{
        await createStudent(formData)}
        await loadStudents()
        setFormData({ name: "", email: "", studentNumber: "", career: "", semester: "" })
        setEditingStudentId(null)
        setshowForm(false)
    } catch (error) {
        console.log(error)
    }
  }

  const handleCancel = () => {
    setshowForm(false)
    setFormData({ name: "", email: "", studentNumber: "", career: "", semester: "" })
  }

  return (

    <div className="module-page">
        {/* HEADER */}
        <div className="module-header">
            <h1 className="module-title">Gestión de Alumnos 🎓</h1>
            <p className="module-subtitle">Administra y visualiza los alumnos registrados</p>
            <button className="auth-button" onClick={() => navigate("/dashboard")}>Regresar</button>
            <button className="auth-button" onClick={() => setshowForm(!showForm)} onSubmit={handleSubmit} style={{ width: "220px" }}>+ Nuevo Alumno</button>
        </div>
            {/*Formulario*/}
            {showForm && (
                <div className="module-form-card">
                    <h5 className="module-form-title">{editingStudentId ? "Editar estudiante" : "Nuevo estudiante"}</h5>
                    <form className="module-form-grid" onSubmit={handleSubmit}>
                        <div className="module-form-group">
                            <label className="module-label">Nombre</label>
                            <input type="text" className="module-input" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">Correo</label>
                            <input type="email" className="module-input" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">Matricula</label>
                            <input type="text" className="module-input" name="studentNumber" value={formData.studentNumber} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">Carrera</label>
                            <input type="text" className="module-input" name="career" value={formData.career} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">Semestre</label>
                            <input type="number" className="module-input" name="semester" value={formData.semester} onChange={handleChange} />
                        </div>
                        <div className="module-form-actions">
                            <button type="submit" className="module-btn-save">{editingStudentId ? "Actualizar Alumno" : "Guardar Alumno"}</button>
                            <button type="button" className="module-btn-cancel" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
            {/* Tabla */}
            {loading ? (<p className="module-loading">Cargando...</p>) : (
                <div className="module-table-card">
                    <table className="module-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Carrera</th>
                                <th>Email</th>
                                <th>Numero de estudiante</th>
                                <th>Semestre</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
          {/* STUDENTS */}
        <tbody>
          {students.length === 0 ? (
            <tr>
                <td colSpan="7" className="module-empty"> No hay alumnos registrados </td>    
            </tr>
            ) : (
                students.map(student => (
                    <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.career}</td>
                        <td>{student.email}</td>
                        <td>{student.studentNumber}</td>
                        <td>{student.semester}</td>
                        <td>
                            <span className={student.status ? "badge-active" : "badge-inactive"}>
                                {student.status ? "😎Activo" : "😓Baja"}
                            </span>
                        </td>
                        <td>
                            <div className="module-actions">
                                <button className="module-btn-edit" onClick={() => handleEdit(student)}>✏️Editar</button>
                                <button className="module-btn-delete" onClick={() => handleDelete(student.id)}>❌Baja</button>
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


export default Students;