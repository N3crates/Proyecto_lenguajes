import { useState, useEffect, useMemo } from "react";
import AppLayout from "../components/layout/AppLayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Grades() {
  const [grades, setGrades] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  useEffect(() => {
  console.log("Teachers state:", teachers);
}, [teachers]);
  const [groups, setGroups] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingGrade, setEditingGrade] = useState(null)
  const [form, setForm] = useState({enrollmentId: "", partial1: "", partial2: "", partial3: "", date: ""})
  const [showInactive, setShowInactive] = useState(false)

  // =====================================
  // FETCH GRADES
  // =====================================
  const fetchGrades = async () => {
    try {
      setLoading(true)
      const res = await api.get("/grades")
      setGrades(res.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // =====================================
  // FETCH ENROLLMENTS
  // =====================================
  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollments")
      setEnrollments(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects")
      setSubjects(res.data.data)
    } catch(err){
      console.log(err)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students")
      setStudents(res.data.data)
    } catch(err){
      console.log(err)
    }
  }

  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups")
      setGroups(res.data.data)
    } catch(err){
      console.log(err)
    }
  }

  const fetchTeachers = async () => {
  try {
    const res = await api.get("/teachers");

    console.log("TEACHERS API:", res.data);

    setTeachers(res.data.data);
  } catch(err){
    console.log("ERROR TEACHERS:", err);
  }
}
  useEffect(() => {
    const load = async () => {
      await Promise.all([
        fetchGrades(),
        fetchEnrollments(),
        fetchSubjects(),
        fetchStudents(),
        fetchGroups(),
        fetchTeachers()
      ])
    }
    load()
  }, [])

  const user = JSON.parse(localStorage.getItem("user"))

  // =====================================
  // FILTER
  // =====================================
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let data = grades
    if(user?.role === "student"){
      const studentDoc = students.find(s => s.userId === user.id)
      data = grades.filter(grade => {
        if(!studentDoc) return false
        const enrollment = enrollments.find(e => e.id === grade.enrollmentId)
        return (enrollment?.studentId === studentDoc.id)
    })
    }
    if(user?.role === "teacher"){data = grades.filter(grade => {
      const enrollment = enrollments.find(e => e.id === grade.enrollmentId)
      if(!enrollment){return false}

      const group = groups?.find(g => g.id === enrollment.groupId)
      
      const teacher = teachers.find(t => t.userId === user.id)
      if(!teacher){return false}

      return (group?.teacherId === teacher?.id)    
  })}
  if(user?.role === "admin" && !showInactive){
    data = data.filter(grade => grade.status === true)
  }

  return data.filter(grade => {
  const enrollment = enrollments.find(e => e.id === grade.enrollmentId)
  if(!enrollment){return false}
  const studentObj = students.find(s => s.id === enrollment.studentId)
  const subjectObj = subjects.find(s => s.id === enrollment.subjectId)
  const student = (studentObj?.name || "").toLowerCase()
  const subject = (subjectObj?.name || subjectObj?.nombre || "").toLowerCase()
  return (student.toLowerCase().includes(q) || subject.toLowerCase().includes(q))})}, 
    [grades, enrollments, students, teachers, groups, search, user])
  
  const studentStats = useMemo(() => {
    if(user?.role !== "student") {return null}
    const total = filtered.length
    const approved = filtered.filter(g => g.finalGrade >= 7).length
    const failed = filtered.filter(g => g.finalGrade < 7).length
    const average = total > 0 ? (filtered.reduce((sum, g) => sum + Number(g.finalGrade || 0), 0) / total).toFixed(2) : 0
    return {total, approved, failed, average}
  }, [filtered, user])

  const teacherStats = useMemo(() => {
    if(user?.role !== "teacher"){return null}
    const approved = filtered.filter(grade => grade.finalGrade >= 7).length
    const failed = filtered.filter(grade => grade.finalGrade < 7).length
    const total = filtered.length
    return {approved, failed, total}
  }, [filtered, user])

  const adminStats = useMemo(() => {
    if(user?.role !== "admin"){return null}
    const approvedStudents = new Set(grades.filter(g => g.finalGrade >= 7).map(g => {
      const enrollment =enrollments.find(e => e.id === g.enrollmentId)
      return enrollment?.studentId}).filter(Boolean)).size
    const failedStudents = new Set(grades.filter(g => g.finalGrade < 7).map(g => {
      const enrollment = enrollments.find(e => e.id === g.enrollmentId)
      return enrollment?.studentId}).filter(Boolean)).size
    const totalStudents = new Set(enrollments.map(e => e.studentId)).size
    const inactive = grades.filter(g => g.status === false).length
    return {approvedStudents, failedStudents, totalStudents, inactive}}, [grades, enrollments, user]
  )

  const availableEnrollments = useMemo(() => {
    // ADMIN
    if(user?.role === "admin"){return enrollments}

    // TEACHER
    if(user?.role === "teacher"){
      return enrollments.filter(
        enrollment => {
          const group = groups?.find(g => g.id === enrollment.groupId)
          const teacher = teachers.find(t => t.userId === user.id)
          if(!teacher){return false}
          return (group?.teacherId === teacher.id)
        }
      )
    }
  return []
}, [enrollments, groups, teachers, user])

  // =====================================
  // HANDLE CHANGE
  // =====================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value
    })
  }

  // =====================================
  // HANDLE SUBMIT
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if(editingGrade){
        await api.put(`/grades/${editingGrade.id}`, form)
      } else {
        const p1 = Number(form.partial1)
        const p2 = Number(form.partial2)
        const p3 = Number(form.partial3)

        if(
          p1 < 0 || p1 > 100 ||
          p2 < 0 || p2 > 100 ||
          p3 < 0 || p3 > 100
        ){
          alert(
            "Las calificaciones deben estar entre 0 y 100"
          )
          return
        }
        await api.post("/grades", form)
      }
      setShowForm(false)
      setEditingGrade(null)
      setForm({enrollmentId: "", partial1: "", partial2: "", partial3: "", date: ""})
      fetchGrades()
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar calificación")
    }
  }

  // =====================================
  // HANDLE EDIT
  // =====================================
  const handleEdit = (grade) => {
    setEditingGrade(grade)
    setForm({
      enrollmentId: grade.enrollmentId || "",
      partial1: grade.partial1 || "",
      partial2: grade.partial2 || "",
      partial3: grade.partial3 || ""
    })
    setShowForm(true)
  }

  // =====================================
  // HANDLE DELETE
  // =====================================
  const handleDelete = async (id) => {
    if(!confirm("¿Dar de baja esta calificación?")) return
    try {
      await api.delete(`/grades/${id}`)
      fetchGrades()
    } catch (err) {
      alert(err.response?.data?.message || "Error al dar de baja")
    }
  }

  // =====================================
  // HANDLE CANCEL
  // =====================================
  const handleCancel = () => {
    setShowForm(false)
    setEditingGrade(null)
    setForm({enrollmentId: "", partial1: "", partial2: "", partial3: "", date: ""})
  }

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* HEADER */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Calificaciones</h1>
            <p className="pg-subtitle">Gestión de calificaciones escolares</p>
          </div>
          
          {(user?.role === "admin" || user?.role === "teacher")&&(
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Nueva Calificación
            </button>
          )}
        </div>

        {/* FORM */}
        {showForm && (
            <div className="pg-card">
              <h5>{editingGrade ? "Editar Calificación" : "Nueva Calificación"}</h5>
              <form onSubmit={handleSubmit}>
                <div className="module-form-grid">
                  <div className="module-form-group">
                    <label className="modal-label">Alumno y Materia</label>
                    <select className="pg-input" name="enrollmentId" value={form.enrollmentId} onChange={handleChange} required>
                    <option value="">Selecciona inscripción</option>
                    {availableEnrollments.map(enrollment => {
                      const student = students?.find(s => String(s.id) === String(enrollment.studentId))
                      const subject = subjects?.find(s => String(s.id) === String(enrollment.subjectId))
                      return ( 
                        <option key={enrollment.id} value={enrollment.id}>
                          {`${student?.name || enrollment.studentId} - ${subject?.nombre || enrollment.subjectId}`}
                        </option>
                      )
                    })}
                    </select>
                  </div>
                  <div className="module-form-group">
                    <label className="modal-label">Parcial 1 </label>
                    <input type="number" className="pg-input" name="partial1" min="0" max="10" value={form.partial1} onChange={handleChange} required/>
                  </div>
                  <div className="module-form-group">
                    <label className="modal-label">Parcial 2 </label>
                    <input type="number" className="pg-input" name="partial2" min="0" max="10" value={form.partial2} onChange={handleChange} required/>
                  </div>
                  <div className="module-form-group">
                    <label className="modal-label">Parcial 3 </label>
                    <input type="number" className="pg-input" name="partial3" min="0" max="10" value={form.partial3} onChange={handleChange} required/>
                  </div>
                  <div className="module-form-group">
                    <label className="modal-label">Fecha</label>
                    <input type="date" className="pg-input" name="date" value={form.date} onChange={handleChange} required/>
                  </div>
                </div>
                <div>
                  <button type="submit" className="btn-primary">{editingGrade ? "Guardar Cambios" : "Crear Calificación"}</button>
                  <button type="button" className="btn-ghost" onClick={handleCancel}>Cancelar</button>
                </div>
              </form>
            </div>
          )}

        {/* ERROR */}
        {error && (<div className="modal-error">{error}</div>)}

        {user?.role === "student" && studentStats && (
          <>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "20px"}}>
              {/* Promedio General */}
              <div className="db-widget g-indigo">
                <div className="db-widget-top">
                  <span className="db-widget-icon">📜</span>
                </div>
                <p className="db-widget-value">{studentStats.average}</p>
                <p className="db-widget-label">Promedio General</p>
              </div>

              {/* Materias Aprobadas */}
              <div className="db-widget g-teal">
                <div className="db-widget-top">
                    <span className="db-widget-icon">👍</span>
                </div>
                <p className="db-widget-value">{studentStats.approved}</p>
                <p className="db-widget-label">Materias Aprobadas</p>
              </div>

              {/* BAJA */}
              <div className="db-widget g-rose">
                <div className="db-widget-top">
                    <span className="db-widget-icon">👎</span>
                  </div>
                  <p className="db-widget-value">{studentStats.failed}</p>
                  <p className="db-widget-label">Materias Reprobadas:</p>
              </div>
            </div>
          </>
        )}

        {user?.role === "teacher" && teacherStats && (
          <>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "20px"}}>
              {/* Promedio General */}
              <div className="db-widget g-indigo">
                <div className="db-widget-top">
                  <span className="db-widget-icon">📜</span>
                </div>
                <p className="db-widget-value">{teacherStats.total}</p>
                <p className="db-widget-label">Total de alumnos calificados</p>
              </div>

              {/* Materias Aprobadas */}
              <div className="db-widget g-teal">
                <div className="db-widget-top">
                    <span className="db-widget-icon">👍</span>
                </div>
                <p className="db-widget-value">{teacherStats.approved}</p>
                <p className="db-widget-label">Alumnos Aprobados</p>
              </div>

              {/* BAJA */}
              <div className="db-widget g-rose">
                <div className="db-widget-top">
                    <span className="db-widget-icon">👎</span>
                  </div>
                  <p className="db-widget-value">{teacherStats.failed}</p>
                  <p className="db-widget-label">Alumnos Reprobados:</p>
              </div>
            </div>
          </>
        )}
        
        {user?.role === "admin" && adminStats && (
          <>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "20px"}}>
              {/* Total */}
              <div className="db-widget g-indigo">
                <div className="db-widget-top">
                    <span className="db-widget-icon">📜</span>
                </div>
                <p className="db-widget-value">{adminStats.totalStudents}</p>
                <p className="db-widget-label">Total Calificaciones</p>
                <p className="db-widget-sub">Registrados en el sistema</p>
              </div>
              
              {/* Aprobados */}
              <div className="db-widget g-teal">
                <div className="db-widget-top">
                    <span className="db-widget-icon">👍</span>
                </div>
                <p className="db-widget-value">{adminStats.approvedStudents}</p>
                <p className="db-windget-label">Alumnos Aprobados</p>
                </div>
              
              {/* Reprobados */}
              <div className="db-widget g-indigo">
                <div className="db-widget-top">
                    <span className="db-widget-icon">👎</span>
                </div>
                <p className="db-widget-value">{adminStats.failedStudents}</p>
                <p className="db-windget-label">Alumnos Reprobados</p>
              </div>

              {/* Baja */}
              <div className="db-widget g-rose">
                <div className="db-widget-top">
                    <span className="db-widget-icon">❌</span>
                  </div>
                  <p className="db-widget-value">{adminStats.inactive}</p>
                  <p className="db-widget-label">Calificaciones Inactivas</p>
                  <p className="db-widget-sub">Inactivos en el sistema</p>
              </div>
            </div>
          </>
        )}

        {/* SEARCH */}
        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">🔍
            <input className="um-search-input" placeholder="Buscar calificación..." value={search} onChange={e => setSearch(e.target.value)}/>
          

          {user?.role === "admin" && (
          <button className="pg-input" onClick={() => setShowInactive(!showInactive)}>
            {showInactive ? "Ocultar bajas" : "Mostrar bajas"}
          </button>
          )}
          </div>

          {search && (
            <button className="btn-ghost" onClick={() => setSearch("")}>Limpiar</button>)}
        </div>

        {/* TABLE */}
        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              {user?.role === "student" ? (
                <tr>
                  <th>Materia</th>
                  <th>Promedio</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              ) : user?.role === "teacher" ? (
                <tr>
                  <th>Alumno</th>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>P1</th>
                  <th>P2</th>
                  <th>P3</th>
                  <th>Promedio</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Status</th>
                </tr>
              ): (
                <tr>
                  <th>Alumno</th>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>P1</th>
                  <th>P2</th>
                  <th>P3</th>
                  <th>Promedio</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="module-loading">Cargando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="module-empty">No se encontraron calificaciones</td>
                </tr>
              ) : (
                filtered.map(grade => {
                  const enrollment = enrollments.find(e => e.id === grade.enrollmentId)
                  if(!enrollment){return null}

                  // =========================
                  // STUDENT
                  // =========================
                  if(user?.role === "student"){
                    return (
                      <tr key={grade.id}>
                        <td>
                          {subjects?.find(s => s.id === enrollment.subjectId)?.nombre || "Sin materia"}
                        </td>
                        <td>
                          {grade.finalGrade || 0}
                        </td>
                        <td>
                          <span className={grade.finalGrade >=7 ? "badge-active" : "badge-inactive"}>
                            {grade.finalGrade >= 7 ? "Aprobado" : "Reprobado"}
                          </span>
                        </td>
                        <td>
                          {grade.date || "-"}
                        </td>
                      </tr>
                    )
                  }

                  // =========================
                  // TEACHER
                  // =========================
                  if(user?.role === "teacher"){
                    const student = students?.find(s => s.id === enrollment.studentId)
                    const subject = subjects?.find(s => s.id === enrollment.subjectId)
                    const group = groups?.find(g => g.id === enrollment.groupId)
                    return (
                      <tr key={grade.id}>
                        <td>{student?.name || "Sin alumno"}</td>
                        <td>{subject?.nombre || "Sin materia"}</td>
                        <td>{group?.name || group?.nombre || "Sin grupo"}</td>
                        <td>{grade.partial1}</td>
                        <td>{grade.partial2}</td>
                        <td>{grade.partial3}</td>
                        <td>{grade.finalGrade}</td>
                        <td>{grade.date || "-"}</td>
                        <td>
                          <span className={grade.finalGrade >=7 ? "badge-active" : "badge-inactive"}>
                            {grade.finalGrade >= 7 ? "Aprobado" : "Reprobado"}
                          </span>
                        </td>
                        <td>
                          <span className={grade.status ? "badge-active" : "badge-inactive"}>
                            {grade.status ? "Activo" : "Baja"}
                          </span>
                        </td>
                      </tr>
                    )
                  }

                  // =========================
                  // ADMIN
                  // =========================
                  const student = students.find(s => s.id === enrollment?.studentId)
                  const subject = subjects.find(s => s.id === enrollment?.subjectId)
                  const group = groups.find(g => g.id === enrollment?.groupId)

                  return (
                    <tr key={grade.id}>
                    <td>{student?.name || "Sin alumno"}</td>
                    <td>{subject?.name || subject?.nombre || "Sin materia"}</td>
                    <td>{group?.name || group?.nombre || "Sin grupo"}</td>
                    <td>{grade.partial1}</td>
                    <td>{grade.partial2}</td>
                    <td>{grade.partial3}</td>
                    <td>{grade.finalGrade}</td>
                    <td>{grade.date || "-"}</td>
                    <td>
                      <span className={grade.finalGrade >=7 ? "badge-active" : "badge-inactive"}>
                        {grade.finalGrade >= 7 ? "Aprobado" : "Reprobado"}
                      </span>
                    </td>
                    <td>
                      <span className={grade.status ? "badge-active" : "badge-inactive"}>
                        {grade.status ? "Activo" : "Baja"}
                      </span>
                    </td>
                    <td>
                      <div className="module-actions">
                        <button className="module-btn-edit" onClick={() => handleEdit(grade)}>Editar</button>
                        <button className={grade.status ? "badge-inactive" : "badge-active"} onClick={() => handleDelete(grade.id)}>
                          {grade.status ? "Baja" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && filtered.length > 0 && (
            <p> Mostrando {filtered.length} de {grades.length} calificaciones</p>
          )
        }
      </div>
    </AppLayout>
  )
}