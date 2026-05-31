// Importaciones necesarias para el componente
import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";
import "../styles/Dashboard.css";

const ITEMS_PER_PAGE = 8;

// Modal de alumnos inscritos en un grupo
function AlumnosModal({ group, enrollments, loading, getStudentName, getTeacherName, getSubjectName, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Alumnos inscritos — {group.nombre}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12.5, color: "var(--text-2)", margin: 0 }}>
            Docente: <strong>{getTeacherName(group.teacherId)}</strong> · Materia: <strong>{getSubjectName(group.subjectId)}</strong> · Ciclo: <strong>{group.ciclo}</strong>
          </p>
        </div>

        {loading ? (
          <p className="module-loading">Cargando alumnos...</p>
        ) : enrollments.length === 0 ? (
          <p className="module-empty">No hay alumnos inscritos en este grupo</p>
        ) : (
          <table className="module-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Alumno</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={enrollment.id}>
                  <td>{index + 1}</td>
                  <td>{getStudentName(enrollment.studentId)}</td>
                  <td>
                    <span className={enrollment.status ? "badge-active" : "badge-inactive"}>
                      {enrollment.status ? "Activo" : "Baja"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function Groups() {
  // Estados principales
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form, setForm] = useState({
    nombre: "", teacherId: "", subjectId: "", ciclo: "", descripcion: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Estados para el modal de alumnos inscritos
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Funcion para obtener grupos, docentes, materias y alumnos del backend
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [groupsRes, teachersRes, subjectsRes, studentsRes] = await Promise.all([
        api.get("/groups"),
        api.get("/teachers"),
        api.get("/subjects"),
        api.get("/students"),
      ]);
      setGroups(groupsRes.data.data);
      setTeachers(teachersRes.data.data);
      setSubjects(subjectsRes.data.data);
      setStudents(studentsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar el componente
  useEffect(() => {
    const load = async () => { await fetchAll(); };
    load();
  }, []);

  // Helpers para obtener nombre del docente, materia y alumno por id
  const getTeacherName = (id) => {
    const t = teachers.find(t => t.id === id);
    return t ? `${t.nombre} ${t.apaterno}` : "—";
  };

  const getSubjectName = (id) => {
    const s = subjects?.find(s => s.id === id);
    return s ? s.nombre : "—";
  };

  // El repository de students ya arma el campo name
  const getStudentName = (id) => {
    const s = students.find(s => s.id === id);
    if (!s) return id;
    return s.name || id;
  };

  // Filtro por busqueda de texto y status
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return groups.filter(g => {
      const matchesSearch =
        g.nombre?.toLowerCase().includes(q) ||
        g.ciclo?.toLowerCase().includes(q) ||
        getTeacherName(g.teacherId).toLowerCase().includes(q) ||
        getSubjectName(g.subjectId).toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? g.status : !g.status);
      return matchesSearch && matchesStatus;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, search, statusFilter, teachers, subjects]);

  // Calculo de paginacion
  const totalPages = Math.max(Math.ceil(filtered.length / ITEMS_PER_PAGE), 1);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  // Abrir modal de alumnos inscritos
  const handleVerAlumnos = async (group) => {
    try {
      setSelectedGroup(group);
      setLoadingEnrollments(true);
      const res = await api.get(`/enrollments/group/${group.id}`);
      setEnrollments(res.data.data);
    } catch (err) {
      setEnrollments([]);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  // Validacion del formulario
  const validate = (data) => {
    const errors = {};
    if (!data.nombre.trim())    errors.nombre    = "El nombre es obligatorio";
    if (!data.teacherId)        errors.teacherId = "Selecciona un docente";
    if (!data.subjectId)        errors.subjectId = "Selecciona una materia";
    if (!data.ciclo.trim())     errors.ciclo     = "El ciclo escolar es obligatorio";
    return errors;
  };

  // Manejo de cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: null });
  };

  // Envio del formulario, crear o editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    try {
      if (editingGroup) {
        await api.put(`/groups/${editingGroup.id}`, form);
      } else {
        await api.post("/groups", form);
      }
      setShowForm(false);
      setEditingGroup(null);
      setForm({ nombre: "", teacherId: "", subjectId: "", ciclo: "", descripcion: "" });
      setFormErrors({});
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar grupo");
    }
  };

  // Cargar datos del grupo en el formulario para editar
  const handleEdit = (group) => {
    setEditingGroup(group);
    setForm({
      nombre: group.nombre || "", teacherId: group.teacherId || "",
      subjectId: group.subjectId || "", ciclo: group.ciclo || "",
      descripcion: group.descripcion || "",
    });
    setFormErrors({});
    setShowForm(true);
  };

  // Baja del grupo
  const handleDelete = async (id) => {
    if (!confirm("¿Dar de baja este grupo?")) return;
    try {
      await api.delete(`/groups/${id}`);
      if (selectedGroup?.id === id) { setSelectedGroup(null); setEnrollments([]); }
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error al dar de baja");
    }
  };

  // Cancelar edicion y limpiar formulario
  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
    setForm({ nombre: "", teacherId: "", subjectId: "", ciclo: "", descripcion: "" });
    setFormErrors({});
  };

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* Modal de alumnos inscritos */}
        {selectedGroup && (
          <AlumnosModal
            group={selectedGroup}
            enrollments={enrollments}
            loading={loadingEnrollments}
            getStudentName={getStudentName}
            getTeacherName={getTeacherName}
            getSubjectName={getSubjectName}
            onClose={() => { setSelectedGroup(null); setEnrollments([]); }}
          />
        )}

        {/* Encabezado de la pagina */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Grupos</h1>
            <p className="pg-subtitle">Gestion de grupos escolares</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Icon name="plus" /> Nuevo Grupo
          </button>
        </div>

        {/* Tarjetas de estadisticas */}
        <div className="db-widgets">
          <div className="db-widget g-indigo">
            <div className="db-widget-top"><span className="db-widget-icon">🏫</span></div>
            <p className="db-widget-value">{groups.length}</p>
            <p className="db-widget-label">Total Grupos</p>
            <p className="db-widget-sub">Registrados en el sistema</p>
          </div>
          <div className="db-widget g-teal">
            <div className="db-widget-top"><span className="db-widget-icon">✅</span></div>
            <p className="db-widget-value">{groups.filter(g => g.status).length}</p>
            <p className="db-widget-label">Grupos Activos</p>
            <p className="db-widget-sub">Activos este ciclo</p>
          </div>
          <div className="db-widget g-rose">
            <div className="db-widget-top"><span className="db-widget-icon">❌</span></div>
            <p className="db-widget-value">{groups.filter(g => !g.status).length}</p>
            <p className="db-widget-label">Grupos de Baja</p>
            <p className="db-widget-sub">Inactivos en el sistema</p>
          </div>
        </div>

        {/* Formulario para crear o editar grupo */}
        {showForm && (
          <div className="pg-card" style={{ padding: "24px 28px" }}>
            <h5 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
              {editingGroup ? "Editar Grupo" : "Nuevo Grupo"}
            </h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="module-form-grid">
                <div className="module-form-group">
                  <label className="modal-label">Nombre *</label>
                  <input className={`pg-input ${formErrors.nombre ? "input-error" : ""}`} name="nombre" value={form.nombre} onChange={handleChange} />
                  {formErrors.nombre && <span className="field-error">{formErrors.nombre}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Ciclo Escolar *</label>
                  <input className={`pg-input ${formErrors.ciclo ? "input-error" : ""}`} name="ciclo" value={form.ciclo} onChange={handleChange} placeholder="2025-1" />
                  {formErrors.ciclo && <span className="field-error">{formErrors.ciclo}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Docente *</label>
                  <select className={`pg-select ${formErrors.teacherId ? "input-error" : ""}`} name="teacherId" value={form.teacherId} onChange={handleChange} style={{ width: "100%" }}>
                    <option value="">Selecciona un docente</option>
                    {teachers.filter(t => t.status).map(t => (
                      <option key={t.id} value={t.id}>{t.nombre} {t.apaterno}</option>
                    ))}
                  </select>
                  {formErrors.teacherId && <span className="field-error">{formErrors.teacherId}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Materia *</label>
                  <select className={`pg-select ${formErrors.subjectId ? "input-error" : ""}`} name="subjectId" value={form.subjectId} onChange={handleChange} style={{ width: "100%" }}>
                    <option value="">Selecciona una materia</option>
                    {subjects.filter(s => s.status).map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                  {formErrors.subjectId && <span className="field-error">{formErrors.subjectId}</span>}
                </div>
                <div className="module-form-group full">
                  <label className="modal-label">Descripcion</label>
                  <input className="pg-input" name="descripcion" value={form.descripcion} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn-primary">
                  {editingGroup ? "Guardar Cambios" : "Crear Grupo"}
                </button>
                <button type="button" className="btn-ghost" onClick={handleCancel}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Buscador y filtros por status */}
        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por nombre, docente, materia o ciclo..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>Status:</span>
            {[
              { label: "Todos", value: "all" },
              { label: "Activo", value: "active" },
              { label: "Baja", value: "inactive" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                style={{
                  padding: "4px 14px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
                  background: statusFilter === opt.value ? "var(--accent)" : "transparent",
                  color: statusFilter === opt.value ? "#fff" : "var(--text)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: statusFilter === opt.value ? 600 : 400,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => { setSearch(""); setPage(1); }}>Limpiar</button>
          )}
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Tabla de grupos */}
        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Docente</th>
                <th>Materia</th>
                <th>Ciclo</th>
                <th>Alumnos</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="module-loading">Cargando...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="7" className="module-empty">No se encontraron grupos</td></tr>
              ) : (
                paginated.map((group) => (
                  <tr key={group.id}>
                    <td>{group.nombre}</td>
                    <td>{getTeacherName(group.teacherId)}</td>
                    <td>{getSubjectName(group.subjectId)}</td>
                    <td>{group.ciclo}</td>

                    <td>
                    <strong>{group.studentCount || 0}</strong>
                    </td>

                    <td>
                    <span className={group.status ? "badge-active" : "badge-inactive"}>
                    {group.status ? "Activo" : "Baja"}
                    </span>
                    </td>
                    <td>
                      <div className="module-actions">
                        {/* Boton para ver alumnos inscritos */}
                        <button className="module-btn-edit" onClick={() => handleVerAlumnos(group)}>
                          Alumnos
                        </button>
                        <button className="module-btn-edit" onClick={() => handleEdit(group)}>Editar</button>
                        <button className="module-btn-delete" onClick={() => handleDelete(group.id)}>Baja</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginacion */}
        {!loading && filtered.length > ITEMS_PER_PAGE && (
          <div className="module-pagination">
            <button className="page-btn" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              ← Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Siguiente →
            </button>
          </div>
        )}

        {/* Contador de resultados */}
        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 12.5, color: "var(--text-2)", textAlign: "center" }}>
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} grupos
          </p>
        )}

      </div>
    </AppLayout>
  );
}