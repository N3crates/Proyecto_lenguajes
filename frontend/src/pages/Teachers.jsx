import { useState, useEffect } from "react";
import AppLayout from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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


  useEffect(() => { fetchTeachers(); }, []);

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
      <div className="module-page">
        <div className="module-header">
          <h2 className="module-title">Docentes</h2>
          <button className="module-btn-new" onClick={() => setShowForm(true)}>
            + Nuevo Docente
          </button>
        </div>

        {error && <div className="module-error">{error}</div>}

        {showForm && (
          <div className="module-form-card">
            <h5 className="module-form-title">
              {editingTeacher ? "Editar Docente" : "Nuevo Docente"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="module-form-grid">
                <div className="module-form-group">
                  <label className="module-label">Nombre *</label>
                  <input className="module-input" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Apellido Paterno *</label>
                  <input className="module-input" name="apaterno" value={form.apaterno} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Apellido Materno</label>
                  <input className="module-input" name="amaterno" value={form.amaterno} onChange={handleChange} />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Email *</label>
                  <input className="module-input" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Teléfono *</label>
                  <input className="module-input" name="telefono" value={form.telefono} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Especialidad *</label>
                  <input className="module-input" name="especialidad" value={form.especialidad} onChange={handleChange} required />
                </div>
                <div className="module-form-group">
                  <label className="module-label">Ciudad</label>
                  <input className="module-input" name="ciudad" value={form.ciudad} onChange={handleChange} />
                </div>
              </div>
              <div className="module-form-actions">
                <button type="submit" className="module-btn-save">
                  {editingTeacher ? "Guardar Cambios" : "Crear Docente"}
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
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Especialidad</th>
                  <th>Ciudad</th>
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr><td colSpan="7" className="module-empty">No hay docentes registrados</td></tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.nombre} {teacher.apaterno} {teacher.amaterno}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.telefono}</td>
                      <td>{teacher.especialidad}</td>
                      <td>{teacher.ciudad}</td>
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
        )}
      </div>
    </AppLayout>
  );
}