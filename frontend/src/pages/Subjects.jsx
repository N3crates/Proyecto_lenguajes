import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

const ITEMS_PER_PAGE = 8;

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState({
    nombre: "", clave: "", creditos: "", semestre: "", descripcion: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/subjects");
      setSubjects(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchSubjects(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return subjects.filter(s =>
      s.nombre?.toLowerCase().includes(q) ||
      s.clave?.toLowerCase().includes(q) ||
      s.descripcion?.toLowerCase().includes(q)
    );
  }, [subjects, search]);

  const totalPages = Math.max(Math.ceil(filtered.length / ITEMS_PER_PAGE), 1);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const validate = (data) => {
    const errors = {};
    if (!data.nombre.trim())   errors.nombre   = "El nombre es obligatorio";
    if (!data.clave.trim())    errors.clave    = "La clave es obligatoria";
    if (!data.creditos)        errors.creditos = "Los créditos son obligatorios";
    else if (isNaN(data.creditos) || Number(data.creditos) <= 0)
                               errors.creditos = "Los créditos deben ser un número mayor a 0";
    if (!data.semestre)        errors.semestre = "El semestre es obligatorio";
    else if (isNaN(data.semestre) || Number(data.semestre) <= 0)
                               errors.semestre = "El semestre debe ser un número mayor a 0";
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
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject.id}`, form);
      } else {
        await api.post("/subjects", form);
      }
      setShowForm(false);
      setEditingSubject(null);
      setForm({ nombre: "", clave: "", creditos: "", semestre: "", descripcion: "" });
      setFormErrors({});
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar materia");
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setForm({
      nombre: subject.nombre || "", clave: subject.clave || "",
      creditos: subject.creditos || "", semestre: subject.semestre || "",
      descripcion: subject.descripcion || "",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Dar de baja esta materia?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error al dar de baja");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubject(null);
    setForm({ nombre: "", clave: "", creditos: "", semestre: "", descripcion: "" });
    setFormErrors({});
  };

  return (
    <AppLayout>
      <div className="pg-wrap">

        <div className="pg-head">
          <div>
            <h1 className="pg-title">Materias</h1>
            <p className="pg-subtitle">Gestión del catálogo de materias</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Icon name="plus" /> Nueva Materia
          </button>
        </div>

        {showForm && (
          <div className="pg-card" style={{ padding: "24px 28px" }}>
            <h5 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
              {editingSubject ? "Editar Materia" : "Nueva Materia"}
            </h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="module-form-grid">

                <div className="module-form-group">
                  <label className="modal-label">Nombre *</label>
                  <input className={`pg-input ${formErrors.nombre ? "input-error" : ""}`} name="nombre" value={form.nombre} onChange={handleChange} />
                  {formErrors.nombre && <span className="field-error">{formErrors.nombre}</span>}
                </div>

                <div className="module-form-group">
                  <label className="modal-label">Clave *</label>
                  <input className={`pg-input ${formErrors.clave ? "input-error" : ""}`} name="clave" value={form.clave} onChange={handleChange} />
                  {formErrors.clave && <span className="field-error">{formErrors.clave}</span>}
                </div>

                <div className="module-form-group">
                  <label className="modal-label">Créditos *</label>
                  <input className={`pg-input ${formErrors.creditos ? "input-error" : ""}`} type="number" name="creditos" value={form.creditos} onChange={handleChange} />
                  {formErrors.creditos && <span className="field-error">{formErrors.creditos}</span>}
                </div>

                <div className="module-form-group">
                  <label className="modal-label">Semestre *</label>
                  <input className={`pg-input ${formErrors.semestre ? "input-error" : ""}`} type="number" name="semestre" value={form.semestre} onChange={handleChange} />
                  {formErrors.semestre && <span className="field-error">{formErrors.semestre}</span>}
                </div>

                <div className="module-form-group full">
                  <label className="modal-label">Descripción</label>
                  <input className="pg-input" name="descripcion" value={form.descripcion} onChange={handleChange} />
                </div>

              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn-primary">
                  {editingSubject ? "Guardar Cambios" : "Crear Materia"}
                </button>
                <button type="button" className="btn-ghost" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por nombre, clave o descripción…"
              value={search}
              onChange={handleSearch}
            />
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => { setSearch(""); setPage(1); }}>Limpiar</button>
          )}
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Clave</th>
                <th>Créditos</th>
                <th>Semestre</th>
                <th>Descripción</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="module-loading">Cargando...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="7" className="module-empty">No se encontraron materias</td></tr>
              ) : (
                paginated.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.nombre}</td>
                    <td>{subject.clave}</td>
                    <td>{subject.creditos}</td>
                    <td>{subject.semestre}</td>
                    <td>{subject.descripcion || "—"}</td>
                    <td>
                      <span className={subject.status ? "badge-active" : "badge-inactive"}>
                        {subject.status ? "Activa" : "Baja"}
                      </span>
                    </td>
                    <td>
                      <div className="module-actions">
                        <button className="module-btn-edit" onClick={() => handleEdit(subject)}>Editar</button>
                        <button className="module-btn-delete" onClick={() => handleDelete(subject.id)}>Baja</button>
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
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} materias
          </p>
        )}

      </div>
    </AppLayout>
  );
}