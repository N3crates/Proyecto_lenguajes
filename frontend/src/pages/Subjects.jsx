import { useState, useEffect } from "react";
import AppLayout from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      <div className="module-page">
        <div className="module-header">
          <h2 className="module-title">Materias</h2>
          <button className="module-btn-new" onClick={() => setShowForm(true)}>
            + Nueva Materia
          </button>
        </div>

        {error && <div className="module-error">{error}</div>}

        {showForm && (
          <div className="module-form-card">
            <h5 className="module-form-title">
              {editingSubject ? "Editar Materia" : "Nueva Materia"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="module-form-grid">
                <div className="module-form-group">
                  <label className="module-label">Nombre *</label>
                  <input className="module-input" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Clave *</label>
                  <input className="module-input" name="clave" value={form.clave} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Créditos *</label>
                  <input className="module-input" type="number" name="creditos" value={form.creditos} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Semestre *</label>
                  <input className="module-input" type="number" name="semestre" value={form.semestre} onChange={handleChange} required />
                </div>
                <div className="module-form-group full">
                  <label className="module-label">Descripción</label>
                  <input className="module-input" name="descripcion" value={form.descripcion} onChange={handleChange} />
                </div>
              </div>
              <div className="module-form-actions">
                <button type="submit" className="module-btn-save">
                  {editingSubject ? "Guardar Cambios" : "Crear Materia"}
                </button>
                <button type="button" className="module-btn-cancel" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="module-loading">Cargando...</p>
        ) : (
          <div className="module-table-card">
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
                {subjects.length === 0 ? (
                  <tr><td colSpan="7" className="module-empty">No hay materias registradas</td></tr>
                ) : (
                  subjects.map((subject) => (
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
        )}
      </div>
    </AppLayout>
  );
}