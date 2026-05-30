import { useState, useEffect, useMemo } from "react"
import AppLayout from "../components/layout/Applayout"
import api from "../api/axios"
import "../styles/Teachers.css"

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState(null)
  const [form, setForm] = useState({studentId: "", groupId: "", subjectId: "", semester: "", enrollmentDate: ""})


  // =====================================
  // FETCH ENROLLMENTS
  // =====================================
  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      const res = await api.get("/enrollments")
      setEnrollments(res.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students")
      setStudents(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects")
      setSubjects(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups")
      setGroups(res.data.data)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const load = async () => {   
      await fetchEnrollments()
      await fetchStudents()
      await fetchSubjects()
      await fetchGroups() 
      }
    load()
  }, [])

  const user = JSON.parse(localStorage.getItem("user"))
  
  // =====================================
  // FILTER
  // =====================================
  const filtered = useMemo(() => {
  const q = search.toLowerCase()
  let data = enrollments

  // STUDENT SOLO VE SUS INSCRIPCIONES
  if(user?.role === "student"){
    const studentDoc = students.find(s => s.userId === user.id)
    data = data.filter(enrollment => enrollment.studentId === studentDoc?.id)
  }

  // FILTRO STATUS
  if(statusFilter === "active"){
    data = data.filter(enrollment => enrollment.status)
  }

  if(statusFilter === "inactive"){
    data = data.filter(enrollment => !enrollment.status)
  }

  return data.filter(enrollment => {
    const studentName =students.find(s => s.id === enrollment.studentId)?.name?.toLowerCase() || ""
    const subjectName = subjects.find(s => s.id === enrollment.subjectId)?.nombre?.toLowerCase() || ""
    const groupName = groups.find(g => g.id === enrollment.groupId)?.nombre?.toLowerCase() || ""

    return (studentName.includes(q) || subjectName.includes(q) || groupName.includes(q))})
    }, [enrollments, search, statusFilter, user, students, subjects, groups])

  // =====================================
  // HANDLE CHANGE
  // =====================================
  const handleChange = (e) => {
    const { name, value } = e.target
    if(name === "groupId"){
      const selectedGroup = groups.find(group => group.id === value)
      setForm({...form, groupId: value, subjectId: selectedGroup?.subjectId || ""})
      return
    }
    setForm({...form, [name]: value})
  }

  // =====================================
  // HANDLE SUBMIT
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if(editingEnrollment){
        await api.put(`/enrollments/${editingEnrollment.id}`, form)
      } else {
        console.log(form)
        await api.post("/enrollments", form)
      }
      setShowForm(false)
      setEditingEnrollment(null)
      setForm({studentId: "", groupId: "", subjectId: "", semester: "", enrollmentDate: ""})
      fetchEnrollments()
    }catch (err) {
      alert(err.response?.data?.message || "Error al guardar inscripción")
    }
  }

  // =====================================
  // HANDLE EDIT
  // =====================================
  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment)
    setForm({studentId: enrollment.studentId || "", groupId: enrollment.groupId || "", subjectId: enrollment.subjectId || "", semester: enrollment.semester || "", 
      enrollmentDate: enrollment.enrollmentDate || ""})
    setShowForm(true)
  }

  // =====================================
  // HANDLE DELETE
  // =====================================
  const handleDelete = async (id) => {
    if(!confirm("¿Dar de baja esta inscripción?")) return
    try {
      await api.delete(`/enrollments/${id}`)
      fetchEnrollments()
    }catch(err){
      alert(err.response?.data?.message || "Error al dar de baja")
    }
  }

  // =====================================
  // HANDLE CANCEL
  // =====================================
  const handleCancel = () => {
    setShowForm(false)
    setEditingEnrollment(null)
    setForm({studentId: "", groupId: "", subjectId: "", semester: "", enrollmentDate: ""})
  }

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* HEADER */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Inscripciones</h1>
            <p className="pg-subtitle">Gestión de inscripciones escolares</p>
          </div>

          {user?.role === "admin" && (<button className="btn-primary" onClick={() => setShowForm(true)}>+ Nueva Inscripción</button>)}
        </div>

        {/* FORM */}
        {showForm && user?.role === "admin" &&(
            <div className="pg-card" style={{padding: "24px 28px"}}>
              <h5 style={{fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20}}>
                {editingEnrollment ? "Editar Inscripción" : "Nueva Inscripción"}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="module-form-grid">
                  <div className="module-form-group">
                    <label className="modal-label"> Alumno </label>
                    <select className="pg-input" name="studentId" value={form.studentId} onChange={handleChange} required>
                      <option value="">Selecciona alumno</option>
                      
                      {students.filter(student => student.status && student.role === "student")
                        .map(student => (
                          <option key={student.id} value={student.id}>{student.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="module-form-group">
                    <label className="modal-label">Grupo </label>
                    <select className="pg-input" name="groupId" value={form.groupId} onChange={handleChange} required>
                    <option value="">Selecciona grupo</option>

                    {
                      groups.filter(group => group.status).map(group => (
                          <option key={group.id} value={group.id}>
                            {`${group.nombre} - ${subjects.find(s => s.id === group.subjectId)?.nombre || group.subjectId}`}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="module-form-group">
                    <label className="modal-label">Materia Asociada</label>
                      <select className="pg-input" value={form.subjectId} disabled>
                        <option value="">Sin materia</option>
                        {
                          subjects.filter(subject => subject.id === form.subjectId).map(subject => (
                            <option key={subject.id} value={subject.id}>{subject.nombre}</option>
                          ))
                      }
                    </select>
                  </div>
                  <div className="module-form-group">
                    <label className="modal-label">Semestre </label>
                  <select className="pg-input" name="semester" value={form.semester} onChange={handleChange} required>
                    <option value="">Selecciona semestre</option>
                    <option value="1">1°</option>
                    <option value="2">2°</option>
                    <option value="3">3°</option>
                    <option value="4">4°</option>
                    <option value="5">5°</option>
                    <option value="6">6°</option>
                    <option value="7">7°</option>
                    <option value="8">8°</option>
                    <option value="9">9°</option>
                  </select>
                </div>
                  <div className="module-form-group">
                    <label className="modal-label">Fecha </label>
                      <input type="date" className="pg-input" name="enrollmentDate" value={form.enrollmentDate} onChange={handleChange} required/>
                  </div>
                </div>
                <div style={{display: "flex", gap: 10, marginTop: 20}}>
                  <button type="submit" className="btn-primary">
                    {editingEnrollment ? "Guardar Cambios" : "Crear Inscripción"}
                  </button>
                  <button type="button" className="btn-ghost" onClick={handleCancel}>Cancelar</button>
                </div>
              </form>
            </div>
          )
        }
        
        {user?.role === "admin" && (
        <>
          {/* STATS */}
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "20px"}}>

              {/* TOTAL */}
              <div className="db-widget g-indigo">
                <div className="db-widget-top">
                    <span className="db-widget-icon">📜</span>
                  </div>
                <p className="db-widget-value">{enrollments.length}</p>
                <p className="db-widget-label">Total Inscripciones</p>
                <p className="db-widget-sub">Registrados en el sistema</p>
              </div>

              {/* ACTIVAS */}
              <div className="db-widget g-teal">
                <div className="db-widget-top">
                    <span className="db-widget-icon">✅</span>
                  </div>
                <p className="db-widget-value">{enrollments.filter(e => e.status).length}</p>
                <p className="db-widget-label">Inscripciones Activas</p>
                <p className="db-widget-sub">Actualmente activos</p>
              </div>


              {/* BAJA */}
              <div className="db-widget g-rose">
                <div className="db-widget-top">
                    <span className="db-widget-icon">❌</span>
                  </div>
                  <p className="db-widget-value">{enrollments.filter(e => !e.status).length}</p>
                  <p className="db-widget-label">Inscripciones Inactivas</p>
                  <p className="db-widget-sub">Inactivos en el sistema</p>
              </div>
            </div>
          </>
        )}

        {/* SEARCH */}
        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">
            <input className="um-search-input" placeholder="🔍 Buscar inscripción..." value={search} onChange={e => setSearch(e.target.value)}/>
            <select className="pg-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">
                Todos
              </option>
              <option value="active">
                Activos
              </option>
              <option value="inactive">
                Baja
              </option>
            </select>
          </div>
          {search && (<button className="btn-ghost" onClick={() => setSearch("")}>Limpiar</button>)}
        </div>

        {/* ERROR */}
        {error && (<div className="modal-error">{error}</div>)}

        {/* TABLE */}
        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Materia</th>
                <th>Grupo</th>
                <th>Fecha</th>
                <th>Status</th>
                {
                  user?.role === "admin" && (<th>Acciones</th>)
                }
              </tr>
            </thead>
            <tbody>
              {
                loading ? (
                  <tr>
                    <td colSpan="6" className="module-loading">Cargando...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="module-empty">No se encontraron inscripciones</td>
                  </tr>
                ) : (
                  filtered.map(
                    enrollment => (
                      <tr key={enrollment.id}>
                        <td>{students.find(student => student.id === enrollment.studentId)?.name || "Sin alumno"}</td>
                        <td>{subjects.find(subject => subject.id === enrollment.subjectId)?.nombre || "Sin materia"}</td>
                        <td>{groups.find(group => group.id === enrollment.groupId)?.nombre || "Sin grupo"}</td>
                        <td>{enrollment.enrollmentDate}</td>
                        <td>
                          <span className={enrollment.status ? "badge-active" : "badge-inactive"}>
                            {enrollment.status ? "Activa" : "Baja"}
                          </span>
                        </td>

                        {user?.role === "admin" &&(<td>
                          <div className="module-actions">
                            <button className="module-btn-edit" onClick={() => handleEdit(enrollment)}>Editar</button>
                            <button className="module-btn-delete" onClick={() => handleDelete(enrollment.id)}>{enrollment.status ? "Dar Baja" : "Activar"}</button>
                          </div>
                        </td>
                      )}
                      </tr>
                    )
                  )
                )
              }
            </tbody>
          </table>
        </div>

        {
          !loading && filtered.length > 0 && (
            <p style={{fontSize: 12.5, color: "var(--text-2)", textAlign: "center"}}>
              Mostrando {filtered.length} de {enrollments.length} inscripciones
            </p>
          )
        }
      </div>
    </AppLayout>
  )
}