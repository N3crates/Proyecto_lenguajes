import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";
import "../styles/Dashboard.css";

const ITEMS_PER_PAGE = 8;

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form, setForm] = useState({
    nombre: "", apaterno: "", amaterno: "",
    email: "", telefono: "", especialidad: "", ciudad: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teachers");
      setTeachers(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTeachers(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter(t =>
      `${t.nombre} ${t.apaterno} ${t.amaterno}`.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.especialidad?.toLowerCase().includes(q) ||
      t.ciudad?.toLowerCase().includes(q)
    );
  }, [teachers, search]);

  const totalPages = Math.max(Math.ceil(filtered.length / ITEMS_PER_PAGE), 1);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const validate = (data) => {
    const errors = {};
    if (!data.nombre.trim())        errors.nombre       = "El nombre es obligatorio";
    if (!data.apaterno.trim())      errors.apaterno     = "El apellido paterno es obligatorio";
    if (!data.email.trim())         errors.email        = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                    errors.email        = "El email no es válido";
    if (!data.telefono.trim())      errors.telefono     = "El teléfono es obligatorio";
    if (!data.especialidad.trim())  errors.especialidad = "La especialidad es obligatoria";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher.id}`, form);
      }
      setShowForm(false);
      setEditingTeacher(null);
      setForm({ nombre: "", apaterno: "", amaterno: "", email: "", telefono: "", especialidad: "", ciudad: "" });
      setFormErrors({});
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar docente");
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setForm({
      nombre: teacher.nombre || "", apaterno: teacher.apaterno || "",
      amaterno: teacher.amaterno || "", email: teacher.email || "",
      telefono: teacher.telefono || "", especialidad: teacher.especialidad || "",
      ciudad: teacher.ciudad || "",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Dar de baja este docente?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Error al dar de baja");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeacher(null);
    setForm({ nombre: "", apaterno: "", amaterno: "", email: "", telefono: "", especialidad: "", ciudad: "" });
    setFormErrors({});
  };

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* Header */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Docentes</h1>
            <p className="pg-subtitle">Gestión del personal docente</p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="db-widgets">
          <div className="db-widget g-indigo">
            <div className="db-widget-top">
              <span className="db-widget-icon">👨‍🏫</span>
            </div>
            <p className="db-widget-value">{teachers.length}</p>
            <p className="db-widget-label">Total Docentes</p>
            <p className="db-widget-sub">Registrados en el sistema</p>
          </div>
          <div className="db-widget g-teal">
            <div className="db-widget-top">
              <span className="db-widget-icon">✅</span>
            </div>
            <p className="db-widget-value">{teachers.filter(t => t.status).length}</p>
            <p className="db-widget-label">Docentes Activos</p>
            <p className="db-widget-sub">Actualmente activos</p>
          </div>
          <div className="db-widget g-rose">
            <div className="db-widget-top">
              <span className="db-widget-icon">❌</span>
            </div>
            <p className="db-widget-value">{teachers.filter(t => !t.status).length}</p>
            <p className="db-widget-label">Docentes de Baja</p>
            <p className="db-widget-sub">Inactivos en el sistema</p>
          </div>
        </div>

        {/* Formulario — solo aparece al editar */}
        {showForm && (
          <div className="pg-card" style={{ padding: "24px 28px" }}>
            <h5 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
              Editar Docente
            </h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="module-form-grid">
                <div className="module-form-group">
                  <label className="modal-label">Nombre *</label>
                  <input className={`pg-input ${formErrors.nombre ? "input-error" : ""}`} name="nombre" value={form.nombre} onChange={handleChange} />
                  {formErrors.nombre && <span className="field-error">{formErrors.nombre}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Apellido Paterno *</label>
                  <input className={`pg-input ${formErrors.apaterno ? "input-error" : ""}`} name="apaterno" value={form.apaterno} onChange={handleChange} />
                  {formErrors.apaterno && <span className="field-error">{formErrors.apaterno}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Apellido Materno</label>
                  <input className="pg-input" name="amaterno" value={form.amaterno} onChange={handleChange} />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Email *</label>
                  <input className={`pg-input ${formErrors.email ? "input-error" : ""}`} type="email" name="email" value={form.email} onChange={handleChange} />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Teléfono *</label>
                  <input className={`pg-input ${formErrors.telefono ? "input-error" : ""}`} name="telefono" value={form.telefono} onChange={handleChange} />
                  {formErrors.telefono && <span className="field-error">{formErrors.telefono}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Especialidad *</label>
                  <input className={`pg-input ${formErrors.especialidad ? "input-error" : ""}`} name="especialidad" value={form.especialidad} onChange={handleChange} />
                  {formErrors.especialidad && <span className="field-error">{formErrors.especialidad}</span>}
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Ciudad</label>
                  <input className="pg-input" name="ciudad" value={form.ciudad} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
                <button type="button" className="btn-ghost" onClick={handleCancel}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Buscador */}
        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por nombre, email, especialidad o ciudad…"
              value={search}
              onChange={handleSearch}
            />
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => { setSearch(""); setPage(1); }}>Limpiar</button>
          )}
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Tabla */}
        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Ciudad</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="module-loading">Cargando...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="7" className="module-empty">No se encontraron docentes</td></tr>
              ) : (
                paginated.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.nombre} {teacher.apaterno} {teacher.amaterno}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.telefono}</td>
                    <td>{teacher.especialidad}</td>
                    <td>{teacher.ciudad || "—"}</td>
                    <td>
                      <span className={teacher.status ? "badge-active" : "badge-inactive"}>
                        {teacher.status ? "Activo" : "Baja"}
                      </span>
                    </td>
                    <td>
                      <div className="module-actions">
                        <button className="module-btn-edit" onClick={() => handleEdit(teacher)}>Editar</button>
                        <button className="module-btn-delete" onClick={() => handleDelete(teacher.id)}>Baja</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 12.5, color: "var(--text-2)", textAlign: "center" }}>
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} docentes
          </p>
        )}

      </div>
    </AppLayout>
  );
}