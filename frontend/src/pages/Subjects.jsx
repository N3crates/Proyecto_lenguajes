import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form, setForm] = useState({
    nombre: "", clave: "", creditos: "", semestre: "", descripcion: "",
  });

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject.id}`, form);
      } else {
        await api.post("/subjects", form);
      }
      setShowForm(false);
      setEditingSubject(null);
      setForm({ nombre: "", clave: "", creditos: "", semestre: "", descripcion: "" });
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
            <form onSubmit={handleSubmit}>
              <div className="module-form-grid">
                <div className="module-form-group">
                  <label className="modal-label">Nombre *</label>
                  <input className="pg-input" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Clave *</label>
                  <input className="pg-input" name="clave" value={form.clave} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Créditos *</label>
                  <input className="pg-input" type="number" name="creditos" value={form.creditos} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Semestre *</label>
                  <input className="pg-input" type="number" name="semestre" value={form.semestre} onChange={handleChange} required />
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
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => setSearch("")}>Limpiar</button>
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
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="module-empty">No se encontraron materias</td></tr>
              ) : (
                filtered.map((subject) => (
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

        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 12.5, color: "var(--text-2)", textAlign: "center" }}>
            Mostrando {filtered.length} de {subjects.length} materias
          </p>
        )}
      </div>
    </AppLayout>
  );
}