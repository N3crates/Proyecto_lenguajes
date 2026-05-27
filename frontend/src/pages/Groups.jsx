import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

const ITEMS_PER_PAGE = 8;

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form, setForm] = useState({
    nombre: "", teacherId: "", subjectId: "", ciclo: "", descripcion: "",
  });
  const [formErrors, setFormErrors] = useState({});

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

  useEffect(() => { 
    const load = async () => { await fetchAll(); };
    load();
  }, []);

  const getTeacherName = (id) => {
    const t = teachers.find(t => t.id === id);
    return t ? `${t.nombre} ${t.apaterno}` : "—";
  };

  const getSubjectName = (id) => {
    const s = subjects.find(s => s.id === id);
    return s ? s.nombre : "—";
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return groups.filter(g =>
      g.nombre?.toLowerCase().includes(q) ||
      g.ciclo?.toLowerCase().includes(q) ||
      getTeacherName(g.teacherId).toLowerCase().includes(q) ||
      getSubjectName(g.subjectId).toLowerCase().includes(q)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, search, teachers, subjects]);

  const totalPages = Math.max(Math.ceil(filtered.length / ITEMS_PER_PAGE), 1);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const validate = (data) => {
    const errors = {};
    if (!data.nombre.trim())    errors.nombre    = "El nombre es obligatorio";
    if (!data.teacherId)        errors.teacherId = "Selecciona un docente";
    if (!data.subjectId)        errors.subjectId = "Selecciona una materia";
    if (!data.ciclo.trim())     errors.ciclo     = "El ciclo escolar es obligatorio";
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
    setFormErrors({});
  };

  return (
    <AppLayout>
      <div className="pg-wrap">

        <div className="pg-head">
          <div>
            <h1 className="pg-title">Grupos</h1>
            <p className="pg-subtitle">Gestión de grupos escolares</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Icon name="plus" /> Nuevo Grupo
          </button>
        </div>

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
                  <label className="modal-label">Descripción</label>
                  <input className="pg-input" name="descripcion" value={form.descripcion} onChange={handleChange} />
                </div>

              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn-primary">
                  {editingGroup ? "Guardar Cambios" : "Crear Grupo"}
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
              placeholder="Buscar por nombre, docente, materia o ciclo…"
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
                <th>Docente</th>
                <th>Materia</th>
                <th>Ciclo</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="module-loading">Cargando...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="6" className="module-empty">No se encontraron grupos</td></tr>
              ) : (
                paginated.map((group) => (
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
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} grupos
          </p>
        )}

      </div>
    </AppLayout>
  );
}