import { useState, useEffect, useMemo } from "react";
import AppLayout from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";
import "../styles/Dashboard.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", studentNumber: ""})

  // =====================================
  // FETCH STUDENTS
  // =====================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students")
      setStudents(res.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const load = async () => { await fetchStudents(); };
    load(); 
}, [])

  // =====================================
  // FILTER
  // =====================================

  const filtered = useMemo(() => { const q = search.toLowerCase()
    return students.filter(student => { const matchesSearch =
      student.name ?.toLowerCase().includes(q) ||
      student.email ?.toLowerCase().includes(q) ||
      student.studentNumber ?.toLowerCase().includes(q)

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && student.status) ||
      (statusFilter === "inactive" && !student.status)

    return (matchesSearch && matchesStatus)
  })
}, [students, search, statusFilter])


  // =====================================
  // HANDLE DELETE
  // =====================================
  const handleDelete = async (id) => {
    if(!confirm("¿Dar de baja este alumno?")) return
    try {
      await api.delete(`/students/${id}`)
      fetchStudents()
    } catch (err) {
      alert(err.response?.data?.message || "Error al dar de baja")
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setForm({
        name: student.name || "",
        email: student.email || "",
        studentNumber: student.studentNumber || "",
        carrera: student.carrera || "",
        semestre: student.semestre || ""
    })
    setShowForm(true)
    }

    const handleChange = (e) => { 
        setForm({ ...form, [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.put(`/students/${editingStudent.id}`, form)
            setShowForm(false)
            setEditingStudent(null)
            fetchStudents()
        } catch (err) {
            console.log(err)
            alert("Error al actualizar")
        }
    }

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* HEADER */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Alumnos</h1>
            <p className="pg-subtitle">Gestión de alumnos escolares</p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="db-widgets">

          {/* TOTAL */}
          <div className="db-widget g-indigo">
            <div className="db-widget-top">
              <span className="db-widget-icon">👨‍🎓</span>
            </div>
            <p className="db-widget-value">{students.length}</p>
            <p className="db-widget-label">Total Alumnos</p>
            <p className="db-widget-sub">Registrados en el sistema</p>
          </div>


          {/* ACTIVOS */}
          <div className="db-widget g-teal">
            <div className="db-widget-top">
              <span className="db-widget-icon">✅</span>
            </div>
            <p className="db-widget-value">
              {students.filter(s => s.status).length}
            </p>
            <p className="db-widget-label">Alumnos Activos</p>
            <p className="db-widget-sub">Actualmente activos</p>
          </div>

          {/* BAJA */}
          <div className="db-widget g-rose">
            <div className="db-widget-top">
              <span className="db-widget-icon">❌</span>
            </div>
            <p className="db-widget-value">{students.filter(s => !s.status).length}</p>
            <p className="db-widget-label">Alumnos de Baja</p>
            <p className="db-widget-sub">Inactivos en el sistema</p>
          </div>
        </div>
        
        {/* EDIT FORM */}
        {showForm && (
          <div className="pg-card">
            <h5>Editar Alumno</h5>
            <form onSubmit={handleSubmit}>
                <div className="module-form-grid">

                  {/* NOMBRE */}
                  <div className="module-form-group">
                    <label className="modal-label">Nombre</label>
                    <input className="pg-input" name="name" value={form.name} onChange={handleChange}/>
                  </div>

                  {/* EMAIL */}
                  <div className="module-form-group">
                    <label className="modal-label">Email</label>
                    <input className="pg-input" name="email" value={form.email} onChange={handleChange}/>
                  </div>

                  {/* MATRICULA */}
                  <div className="module-form-group">
                    <label className="modal-label">Matrícula</label>
                    <input className="pg-input" name="studentNumber" value={form.studentNumber} onChange={handleChange}/>
                  </div>
                </div>

<div className="module-form-grid">

  {/* NOMBRE */}
  <div className="module-form-group">
    <label className="modal-label">Nombre</label>
    <input
      className="pg-input"
      name="name"
      value={form.name}
      onChange={handleChange}
    />
  </div>

  {/* EMAIL */}
  <div className="module-form-group">
    <label className="modal-label">Email</label>
    <input
      className="pg-input"
      name="email"
      value={form.email}
      onChange={handleChange}
    />
  </div>

  {/* MATRICULA */}
  <div className="module-form-group">
    <label className="modal-label">Matrícula</label>
    <input
      className="pg-input"
      name="studentNumber"
      value={form.studentNumber}
      onChange={handleChange}
    />
  </div>

  {/* CARRERA */}
  <div className="module-form-group">
    <label className="modal-label">Carrera</label>
    <input
      className="pg-input"
      name="carrera"
      value={form.carrera}
      onChange={handleChange}
    />
  </div>

  {/* SEMESTRE */}
  <div className="module-form-group">
    <label className="modal-label">Semestre</label>
    <input
      className="pg-input"
      name="semestre"
      type="number"
      min="1"
      value={form.semestre}
      onChange={handleChange}
    />
  </div>

</div>
                {/* BOTONES */}
                <div>
                  <button type="submit" className="btn-primary">Guardar Cambios</button>
                  <button type="button" className="btn-ghost" onClick={() => {setShowForm(false); setEditingStudent(null);}}>
                    Cancelar
                  </button>
                </div>
            </form>
          </div>
        )}

        {/* SEARCH */}
        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">
            🔍
            <input className="um-search-input" placeholder="Buscar alumno..." value={search}
                onChange={e => setSearch(e.target.value)}/>
            <select className="pg-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Baja</option>
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
                <th>Nombre</th>
                <th>Email</th>
                <th>Matrícula</th>
                <th>Carrera</th>
                <th>Semestre</th>
                <th>Rol</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr>
                    <td colSpan="6" className="module-loading">Cargando...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="module-empty">No se encontraron alumnos</td>
                  </tr>
                ) : (
                  filtered.map(
                    student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.studentNumber || "Sin matrícula"}</td>
                        <td>{student.carrera || "Sin carrera"}</td>
                        <td>{student.semestre || "Sin Semestre"}</td>
                        <td>{student.role}</td>
                        <td>
                          <span className={student.status ? "badge-active" : "badge-inactive"}>
                            {student.status ? "Activo" : "Baja"}
                          </span>
                        </td>
                        <td>
                          <div className="module-actions">
                            <button className="module-btn-edit" onClick={() => handleEdit(student)}>Editar</button>
                            <button className={student.status ? "module-btn-delete" : "module-btn-edit"} onClick={() => handleDelete(student.id)}>
                                {student.status ? "Dar Baja" : "Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )
              }
            </tbody>
          </table>
        </div>
        
        {!loading && filtered.length > 0 && (
            <p style={{fontSize: 12.5, color: "var(--text-2)", textAlign: "center"}}>
              Mostrando {filtered.length} de {students.length} alumnos
            </p>
          )
        }
      </div>
    </AppLayout>
  )
}