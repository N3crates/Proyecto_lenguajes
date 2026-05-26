import { useEffect, useState, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
} from "../services/enrollmentService";
import "../styles/Enrrollments.css";

// ─── API helpers para cargar listas ──────────────────────────────────────────
const fetchList = async (endpoint) => {
  const token = localStorage.getItem("token");
  const res   = await fetch(`http://localhost:3000/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data || json[endpoint] || json;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (val) => {
  if (!val) return "—";
  try { return new Date(val).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return val; }
};

<<<<<<< Updated upstream
// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`pg-toast ${type}`}>{msg}</div>;
=======
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleEdit = (enrollment) => {
        setshowForm(true)
        setEditingEnrollmentId(enrollment.id)
        setFormData({studentId: enrollment.studentId || "", subjectId: enrollment.subjectId || "", groupId: enrollment.groupId || "", enrollmentData: enrollment.enrollmentData || ""})
    }
    
    const handleDelete = async(id) => {
        const confirmDelete = window.confirm("¿Desea dar de baja esta inscripción?")
        if(!confirmDelete) return
        try {
            await deleteEnrollment(id)
            setEnrollments(prevEnrollmets => prevEnrollmets.map(enrollment => enrollment.id === id ? {...enrollment, status: false} : enrollment))
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            if(editingEnrollmentId){
                await updateEnrollment(editingEnrollmentId, formData)
            }else{
                await createEnrollment(formData)}
                await loadEnrollments()
                setFormData({studentId: "", subjectId: "", groupId: "", enrollmentData: ""})
                setEditingEnrollmentId(null)
                setshowForm(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setshowForm(false)
        setFormData({studentId: "", subjectId: "", groupId: "", enrollmentData: ""})
    }

    return(
        <div className="module-page">
            {/* HEADER */}
            <div className="module-header">
                <h1 className="module-title">Gestión de Inscripciones 🗂️</h1>
                <p className="module-subtitle">Administra y visualiza las Inscripciones registradas</p>
                <button className="auth-button" onClick={() => navigate("/dashboard")}>Regresar</button>
                <button className="auth-button" onClick={() => setshowForm(!showForm)} onSubmit={handleSubmit}>+ Nueva Inscripción</button>
            </div>
            {/*Formulario*/}
            {showForm && (
                <div className="module-form-card">
                    <h5 className="module-form-title">{editingEnrollmentId ? "Editar inscripcion" : "Nuevo Estudiante"}</h5>
                    <form className="module-form-group">
                        <div className="module-form-group">
                            <label className="module-label">ID Alumno</label>
                            <input type="text" className="module-input" name="studentId" value={formData.studentId} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">ID Materia</label>
                            <input type="text" className="module-input" name="subjectId" value={formData.subjectId} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">ID Grupo</label>
                            <input type="text" className="module-input" name="groupId" value={formData.groupId} onChange={handleChange} />
                        </div>
                        <div className="module-form-group">
                            <label className="module-label">Fecha</label>
                            <input type="text" className="module-input" name="enrollmentData" value={formData.enrollmentData} onChange={handleChange} />
                        </div>
                        <div className="module-form-actions">
                            <button type="submit" className="module-btn-save">{editingEnrollmentId ? "Actualizar Inscripcion" : "Guardar Alumno"}</button>
                            <button className="module-btn-cancel" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
            {/*Tabla*/}
            {loading ? (<p className="module-loading">Cargando...</p>) : (
                <div className="module-table-card">
                    <table className="module-table">
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>Materia</th>
                                <th>Grupo</th>
                                <th>Fecha</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        {/* ENROLLMENTS */}
                        <tbody>
                            {enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="module-empty">No hay Inscripciones registradas</td>
                                </tr>
                            ) : (
                                enrollments.map(enrollment => (
                                    <tr key={enrollment.id}>
                                        <td>{enrollment.studentId}</td>
                                        <td>{enrollment.subjectId}</td>
                                        <td>{enrollment.groupId}</td>
                                        <td>{enrollment.enrollmentData}</td>
                                        <td>
                                            <span className={enrollment.status ? "badge-active" : "badge-inactive"}>
                                                {enrollment.status ? "😎Activo" : "😓Baja"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="module-actions">
                                                <button className="module-btn-edit" onClick={() => handleEdit(enrollment)}>✏️Editar</button>
                                                <button className="module-btn-delete" onClick={() => handleDelete(enrollment.id)}>❌Baja</button>
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
    )
>>>>>>> Stashed changes
}

// ─── Modal: Crear / Editar inscripción ────────────────────────────────────────
function EnrollmentModal({ enrollment, students, subjects, groups, onClose, onSaved }) {
  const isEdit = !!enrollment;

  const [form, setForm] = useState(
    isEdit
      ? {
          studentId: enrollment.studentId || "",
          subject:   enrollment.subject   || "",
          group:     enrollment.group     || "",
        }
      : { studentId: "", subject: "", group: "" }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async () => {
    setError(null);
    if (!form.studentId || !form.subject || !form.group)
      return setError("Selecciona alumno, materia y grupo.");
    setLoading(true);
    try {
      let result;
      if (isEdit) {
        result = await updateEnrollment(enrollment.id, form);
      } else {
        result = await createEnrollment(form);
      }
      onSaved(result?.data || result);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? "Editar inscripción" : "Nueva inscripción"}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-field">
          <label className="modal-label">Alumno</label>
          <select className="pg-select" style={{ width: "100%" }}
            value={form.studentId}
            onChange={e => setForm({ ...form, studentId: e.target.value })}>
            <option value="">— Selecciona un alumno —</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.nombre} {s.apaterno} {s.amaterno || ""}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <label className="modal-label">Materia</label>
          <select className="pg-select" style={{ width: "100%" }}
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}>
            <option value="">— Selecciona una materia —</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.nombre || s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <label className="modal-label">Grupo</label>
          <select className="pg-select" style={{ width: "100%" }}
            value={form.group}
            onChange={e => setForm({ ...form, group: e.target.value })}>
            <option value="">— Selecciona un grupo —</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.nombre || g.name} {g.grado ? `— ${g.grado}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear inscripción"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Confirmar baja ────────────────────────────────────────────────────
function DeleteModal({ enrollment, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteEnrollment(enrollment.id);
      onDeleted(enrollment.id);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Dar de baja inscripción</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="um-confirm-text">
          ¿Confirmas dar de baja esta inscripción?<br />
          El alumno quedará sin activo en esta materia y grupo.
        </p>
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Procesando…" : "Sí, dar de baja"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students,    setStudents]    = useState([]);
  const [subjects,    setSubjects]    = useState([]);
  const [groups,      setGroups]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState("all"); // all | active | inactive
  const [modal,       setModal]       = useState(null);  // { type, enrollment? }
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    const load = async () => {
      try {
        const [enr, stu, sub, grp] = await Promise.all([
          getEnrollments(),
          fetchList("students"),
          fetchList("subjects"),
          fetchList("groups"),
        ]);
        setEnrollments(enr.data || enr);
        setStudents(stu);
        setSubjects(sub);
        setGroups(grp);
      } catch (e) { showToast(e.message, "error"); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Diccionarios para resolver IDs → nombres
  const studentMap = useMemo(() =>
    Object.fromEntries(students.map(s => [s.id, `${s.nombre} ${s.apaterno}`])),
  [students]);

  const subjectMap = useMemo(() =>
    Object.fromEntries(subjects.map(s => [s.id, s.nombre || s.name])),
  [subjects]);

  const groupMap = useMemo(() =>
    Object.fromEntries(groups.map(g => [g.id, g.nombre || g.name])),
  [groups]);

  // Resolución de nombre: si el valor es un ID conocido devuelve el nombre, si no lo deja tal cual
  const resolveName = (map, val) => map[val] || val || "—";

  // Filtrado
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enrollments.filter(e => {
      const studentName = (studentMap[e.studentId] || e.studentId || "").toLowerCase();
      const subjectName = (subjectMap[e.subject]   || e.subject   || "").toLowerCase();
      const groupName   = (groupMap[e.group]       || e.group     || "").toLowerCase();
      const matchSearch = studentName.includes(q) || subjectName.includes(q) || groupName.includes(q);
      const matchStatus =
        statusFilter === "all"      ||
        (statusFilter === "active"   &&  e.status) ||
        (statusFilter === "inactive" && !e.status);
      return matchSearch && matchStatus;
    });
  }, [enrollments, search, statusFilter, studentMap, subjectMap, groupMap]);

  // Conteos
  const totals = useMemo(() => ({
    total:    enrollments.length,
    active:   enrollments.filter(e => e.status).length,
    inactive: enrollments.filter(e => !e.status).length,
  }), [enrollments]);

  const onSaved = (saved) => {
    if (!saved) { /* recarga suave */
      showToast("Inscripción guardada.");
      return;
    }
    setEnrollments(prev => {
      const idx = prev.findIndex(e => e.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
    showToast("Inscripción guardada correctamente.");
  };

  const onDeleted = (id) => {
    // No borramos del estado: marcamos como inactivo (soft delete)
    setEnrollments(prev =>
      prev.map(e => e.id === id ? { ...e, status: false } : e)
    );
    showToast("Inscripción dada de baja.");
  };

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* Encabezado */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Inscripciones</h1>
            <p className="pg-subtitle">Gestiona la inscripción de alumnos a materias y grupos</p>
          </div>
          <button className="btn-primary" onClick={() => setModal({ type: "create" })}>
            <Icon name="plus" /> Nueva inscripción
          </button>
        </div>

        {/* Chips de resumen */}
        {!loading && (
          <div className="en-chips">
            {[
              { key: "all",      label: "Total",    val: totals.total,    cls: "" },
              { key: "active",   label: "Activas",  val: totals.active,   cls: "enc-active" },
              { key: "inactive", label: "Bajas",    val: totals.inactive, cls: "enc-inactive" },
            ].map(c => (
              <button key={c.key}
                className={`en-chip ${c.cls} ${statusFilter === c.key ? "active" : ""}`}
                onClick={() => setStatusFilter(c.key)}>
                <span className="en-chip-val">{c.val}</span>
                <span className="en-chip-lbl">{c.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Buscador */}
        <div className="pg-card en-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por alumno, materia o grupo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="pg-card en-table-card">
          {loading ? (
            <div className="en-sk-wrap">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="en-sk-row">
                  <div className="sk" style={{ width: "22%", height: 13 }} />
                  <div className="sk" style={{ width: "20%", height: 13 }} />
                  <div className="sk" style={{ width: "18%", height: 13 }} />
                  <div className="sk" style={{ width: "14%", height: 13 }} />
                  <div className="sk" style={{ width: 60,    height: 22, borderRadius: 100 }} />
                  <div className="sk" style={{ width: 80,    height: 28, borderRadius: 7 }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="pg-empty">No se encontraron inscripciones.</div>
          ) : (
            <table className="en-table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>Fecha de alta</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} className={!e.status ? "en-row-inactive" : ""}>
                    <td className="en-cell-name">
                      <div className="en-avatar">
                        {resolveName(studentMap, e.studentId).charAt(0).toUpperCase()}
                      </div>
                      {resolveName(studentMap, e.studentId)}
                    </td>
                    <td>{resolveName(subjectMap, e.subject)}</td>
                    <td>{resolveName(groupMap, e.group)}</td>
                    <td className="en-date">{fmtDate(e.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${e.status ? "status-active" : "status-inactive"}`}>
                        {e.status ? "Activa" : "Baja"}
                      </span>
                    </td>
                    <td>
                      <div className="um-actions">
                        {e.status && (
                          <>
                            <button className="btn-icon" title="Editar"
                              onClick={() => setModal({ type: "edit", enrollment: e })}>
                              <Icon name="edit" />
                            </button>
                            <button className="btn-icon danger" title="Dar de baja"
                              onClick={() => setModal({ type: "delete", enrollment: e })}>
                              <Icon name="trash" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {modal?.type === "create" && (
        <EnrollmentModal
          students={students} subjects={subjects} groups={groups}
          onClose={() => setModal(null)} onSaved={onSaved}
        />
      )}
      {modal?.type === "edit" && (
        <EnrollmentModal
          enrollment={modal.enrollment}
          students={students} subjects={subjects} groups={groups}
          onClose={() => setModal(null)} onSaved={onSaved}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteModal
          enrollment={modal.enrollment}
          onClose={() => setModal(null)} onDeleted={onDeleted}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}