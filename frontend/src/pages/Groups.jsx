import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form, setForm] = useState({
    nombre: "", teacherId: "", subjectId: "", ciclo: "", descripcion: "",
  });

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [groupsRes, teachersRes, subjectsRes] = await Promise.all([
        api.get("/groups"),
        api.get("/teachers"),
        api.get("/subjects"),
      ]);
      setGroups(groupsRes.data.data);
      setTeachers(teachersRes.data.data);
      setSubjects(subjectsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await api.put(`/groups/${editingGroup.id}`, form);
      } else {
        await api.post("/groups", form);
      }
      setShowForm(false);
      setEditingGroup(null);
      setForm({ nombre: "", teacherId: "", subjectId: "", ciclo: "", descripcion: "" });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error al guardar grupo");
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setForm({
      nombre: group.nombre || "", teacherId: group.teacherId || "",
      subjectId: group.subjectId || "", ciclo: group.ciclo || "",
      descripcion: group.descripcion || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Dar de baja este grupo?")) return;
    try {
      await api.delete(`/groups/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error al dar de baja");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
    setForm({ nombre: "", teacherId: "", subjectId: "", ciclo: "", descripcion: "" });
  };

  const getTeacherName = (id) => {
    const t = teachers.find((t) => t.id === id);
    return t ? `${t.nombre} ${t.apaterno}` : "—";
  };

  const getSubjectName = (id) => {
    const s = subjects.find((s) => s.id === id);
    return s ? s.nombre : "—";
  };

  return (
    <div className="module-page">
      <div className="module-header">
        <h2 className="module-title">Grupos</h2>
        <button className="module-btn-new" onClick={() => setShowForm(true)}>
          + Nuevo Grupo
        </button>
      </div>

      {error && <div className="module-error">{error}</div>}

      {showForm && (
        <div className="module-form-card">
          <h5 className="module-form-title">
            {editingGroup ? "Editar Grupo" : "Nuevo Grupo"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="module-form-grid">
              <div className="module-form-group">
                <label className="module-label">Nombre *</label>
                <input className="module-input" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div className="module-form-group">
                <label className="module-label">Ciclo Escolar *</label>
                <input className="module-input" name="ciclo" value={form.ciclo} onChange={handleChange} required placeholder="2025-1" />
              </div>
              <div className="module-form-group">
                <label className="module-label">Docente *</label>
                <select className="module-select" name="teacherId" value={form.teacherId} onChange={handleChange} required>
                  <option value="">Selecciona un docente</option>
                  {teachers.filter(t => t.status).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} {t.apaterno}
                    </option>
                  ))}
                </select>
              </div>
              <div className="module-form-group">
                <label className="module-label">Materia *</label>
                <select className="module-select" name="subjectId" value={form.subjectId} onChange={handleChange} required>
                  <option value="">Selecciona una materia</option>
                  {subjects.filter(s => s.status).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="module-form-group full">
                <label className="module-label">Descripción</label>
                <input className="module-input" name="descripcion" value={form.descripcion} onChange={handleChange} />
              </div>
            </div>
            <div className="module-form-actions">
              <button type="submit" className="module-btn-save">
                {editingGroup ? "Guardar Cambios" : "Crear Grupo"}
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
                <th>Docente</th>
                <th>Materia</th>
                <th>Ciclo</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {groups.length === 0 ? (
                <tr>
                  <td colSpan="6" className="module-empty">No hay grupos registrados</td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr key={group.id}>
                    <td>{group.nombre}</td>
                    <td>{getTeacherName(group.teacherId)}</td>
                    <td>{getSubjectName(group.subjectId)}</td>
                    <td>{group.ciclo}</td>
                    <td>
                      <span className={group.status ? "badge-active" : "badge-inactive"}>
                        {group.status ? "Activo" : "Baja"}
                      </span>
                    </td>
                    <td>
                      <div className="module-actions">
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
      )}
    </div>
  );
}