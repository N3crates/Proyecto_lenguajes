import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form, setForm] = useState({
    nombre: "", apaterno: "", amaterno: "",
    email: "", telefono: "", especialidad: "", ciudad: "",
  });

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher.id}`, form);
      } else {
        await api.post("/teachers", form);
      }
      setShowForm(false);
      setEditingTeacher(null);
      setForm({ nombre: "", apaterno: "", amaterno: "", email: "", telefono: "", especialidad: "", ciudad: "" });
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
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Icon name="plus" /> Nuevo Docente
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="pg-card" style={{ padding: "24px 28px" }}>
            <h5 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
              {editingTeacher ? "Editar Docente" : "Nuevo Docente"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="module-form-grid">
                <div className="module-form-group">
                  <label className="modal-label">Nombre *</label>
                  <input className="pg-input" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Apellido Paterno *</label>
                  <input className="pg-input" name="apaterno" value={form.apaterno} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Apellido Materno</label>
                  <input className="pg-input" name="amaterno" value={form.amaterno} onChange={handleChange} />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Email *</label>
                  <input className="pg-input" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Teléfono *</label>
                  <input className="pg-input" name="telefono" value={form.telefono} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Especialidad *</label>
                  <input className="pg-input" name="especialidad" value={form.especialidad} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="modal-label">Ciudad</label>
                  <input className="pg-input" name="ciudad" value={form.ciudad} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn-primary">
                  {editingTeacher ? "Guardar Cambios" : "Crear Docente"}
                </button>
                <button type="button" className="btn-ghost" onClick={handleCancel}>
                  Cancelar
                </button>
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
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => setSearch("")}>Limpiar</button>
          )}
        </div>

        {/* Error */}
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
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="module-empty">No se encontraron docentes</td></tr>
              ) : (
                filtered.map((teacher) => (
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

        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 12.5, color: "var(--text-2)", textAlign: "center" }}>
            Mostrando {filtered.length} de {teachers.length} docentes
          </p>
        )}
      </div>
    </AppLayout>
  );
}