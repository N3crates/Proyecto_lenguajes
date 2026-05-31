import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import "../styles/Users.css";

const roleLabel = { admin: "Administrador", teacher: "Docente", student: "Estudiante" };
const roleColor = { admin: "rb-admin", teacher: "rb-teacher", student: "rb-student" };

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "U";

const getRoleLabel = (r) => {
  if (roleLabel[r]) return roleLabel[r];
  return r.charAt(0).toUpperCase() + r.slice(1); 
};

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`pg-toast ${type}`}>{msg}</div>;
}

// ── Modal crear / editar usuario — ACTUALIZADO CON CAMPOS DINÁMICOS ───────────
function UserModal({ user, rolesList, onClose, onSaved }) {
  const isEdit = !!user;
  const [form, setForm] = useState(
    isEdit
      ? { name: user.name, email: user.email, role: user.role, status: user.status }
      : { 
          name: "", 
          email: "", 
          password: "", 
          role: "student", 
          status: "active",
          ciudad: "",
          especialidad: "", 
          telefono: "",     
          matricula: "",
          carrera: "",
          semestre: ""
        }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim() || !form.email.trim()) return setError("Nombre y correo son obligatorios.");
    if (!isEdit && !form.password) return setError("La contraseña es obligatoria.");
    
    // Validaciones opcionales para campos específicos al crear
    if (!isEdit && form.role === 'student') {
      if (!form.matricula.trim() || !form.carrera.trim() || !form.semestre.trim()) {
        return setError("Matrícula, carrera y semestre son obligatorios para estudiantes.");
      }
    }
    if (!isEdit && form.role === 'teacher') {
      if (!form.ciudad.trim() || !form.especialidad.trim() || !form.telefono.trim()) {
        return setError("Ciudad, especialidad y teléfono son obligatorios para docentes.");
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = isEdit ? `http://localhost:3000/api/users/${user.id || user.uid}` : "http://localhost:3000/api/users";
      const method = isEdit ? "PUT" : "POST";
      
      // ÚNICA declaración del body con TODOS los campos completos
      const body = isEdit
        ? { name: form.name, role: form.role, status: form.status }
        : { 
            name: form.name, 
            email: form.email, 
            password: form.password, 
            role: form.role,
            ciudad: form.ciudad,
            especialidad: form.especialidad,
            telefono: form.telefono,         
            matricula: form.matricula,
            carrera: form.carrera,
            semestre: form.semestre
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error al guardar");
      
      let savedUser;
      if (isEdit) {
        savedUser = { ...user, name: form.name, role: form.role, status: form.status };
      } else {
        savedUser = json.data || json.user || json;
      }

      onSaved(savedUser);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? "Editar usuario" : "Nuevo usuario"}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="modal-error">{error}</div>}

        <div className="um-form-grid">
          <div className="modal-field">
            <label className="modal-label">Nombre completo</label>
            <input className="pg-input" placeholder="Ej. Juan Pérez"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Correo electrónico</label>
            <input className="pg-input" type="email" placeholder="usuario@escuela.edu"
              value={form.email} disabled={isEdit}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          {!isEdit && (
            <div className="modal-field">
              <label className="modal-label">Contraseña inicial</label>
              <input className="pg-input" type="password" placeholder="Mínimo 6 caracteres"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div className="modal-field">
            <label className="modal-label">Rol</label>
            <select className="pg-select" value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}>
              {rolesList.map(r => (
                <option key={r} value={r}>
                  {getRoleLabel(r)}
                </option>
              ))}
            </select>
          </div>
          {isEdit && (
            <div className="modal-field">
              <label className="modal-label">Estado</label>
              <select className="pg-select" value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          )}

          {/* ── SECCIÓN DINÁMICA: DOCENTES (Solo al crear) ── */}
          {!isEdit && form.role === "teacher" && (
            <>
              <div className="modal-field">
                <label className="modal-label">Ciudad</label>
                <input className="pg-input" placeholder="Ej. Guanajuato"
                  value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Especialidad</label>
                <input className="pg-input" placeholder="Ej. Desarrollo Web, IA"
                  value={form.especialidad} onChange={e => setForm({ ...form, especialidad: e.target.value })} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Teléfono</label>
                <input className="pg-input" placeholder="Ej. 4731234567"
                  value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
            </>
          )}

          {/* ── SECCIÓN DINÁMICA: ESTUDIANTES (Solo al crear) ── */}
          {!isEdit && form.role === "student" && (
            <>
              <div className="modal-field">
                <label className="modal-label">Matrícula</label>
                <input className="pg-input" placeholder="Ej. MAT-2026-001"
                  value={form.matricula} onChange={e => setForm({ ...form, matricula: e.target.value })} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Carrera</label>
                <input className="pg-input" placeholder="Ej. Ingeniería en Sistemas"
                  value={form.carrera} onChange={e => setForm({ ...form, carrera: e.target.value })} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Semestre</label>
                <input className="pg-input" type="number" min="1" placeholder="Ej. 1"
                  value={form.semestre} onChange={e => setForm({ ...form, semestre: e.target.value })} />
              </div>
            </>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal confirmar eliminación ───────────────────────────────────────────────
function DeleteModal({ user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/users/${user.id || user.uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error al eliminar");
      onDeleted(user.id || user.uid);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Eliminar usuario</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="um-confirm-text">
          ¿Estás seguro de eliminar a <strong>{user.name}</strong>?<br/>
          Esta acción no se puede deshacer.
        </p>
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [rolesList, setRolesList] = useState(["admin", "teacher", "student"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [resUsers, resRoles] = await Promise.all([
          fetch("http://localhost:3000/api/users", { headers }),
          fetch("http://localhost:3000/api/roles", { headers })
        ]);

        const jsonUsers = await resUsers.json();
        const jsonRoles = await resRoles.json();

        if (!resUsers.ok) throw new Error(jsonUsers.message);

        setUsers(jsonUsers.data || jsonUsers.users || jsonUsers);

        const dbRoles = jsonRoles.data || jsonRoles.roles || jsonRoles || [];
        const dynamicRoles = dbRoles.map(r => r.name);
        const combinedRoles = [...new Set(["admin", "teacher", "student", ...dynamicRoles])]; 
        setRolesList(combinedRoles);

      } catch (e) { showToast(e.message, "error"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const prev = [...users];
    setUsers(u => u.map(x => (x.id || x.uid) === userId ? { ...x, role: newRole } : x));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      showToast("Rol actualizado.");
    } catch (e) {
      setUsers(prev);
      showToast(e.message, "error");
    }
  };

  const filtered = useMemo(() =>
    users.filter(u => {
      const q = search.toLowerCase();
      const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchRole   = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    }), [users, search, roleFilter]);

  const onSaved = (saved) => {
    setUsers(prev => {
      const id = saved.id || saved.uid;
      const idx = prev.findIndex(u => (u.id || u.uid) === id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
    showToast("Usuario guardado correctamente.");
  };

  const onDeleted = (id) => {
    setUsers(prev => prev.filter(u => (u.id || u.uid) !== id));
    showToast("Usuario eliminado.");
  };

  // ── Lógica mejorada de Tarjetas Resumen ─────────────────────────────────────
  const summaryChips = useMemo(() => {
    // 1. Contamos cuántos usuarios hay por cada rol
    const counts = { total: users.length, admin: 0, teacher: 0, student: 0 };
    
    users.forEach(u => {
      if (u.role) {
        counts[u.role] = (counts[u.role] || 0) + 1;
      }
    });

    // 2. Definimos las tarjetas principales (siempre se muestran, aunque estén en 0)
    const chips = [
      { id: "total", label: "Total", value: counts.total, cls: "" },
      { id: "admin", label: "Admins", value: counts.admin, cls: "chip-red" },
      { id: "teacher", label: "Docentes", value: counts.teacher, cls: "chip-indigo" },
      { id: "student", label: "Estudiantes", value: counts.student, cls: "chip-teal" },
    ];

    // 3. Añadimos dinámicamente tarjetas para roles extra, solo si tienen usuarios asignados (> 0)
    Object.keys(counts).forEach(role => {
      if (!["total", "admin", "teacher", "student"].includes(role) && counts[role] > 0) {
        chips.push({
          id: role,
          label: getRoleLabel(role),
          value: counts[role],
          cls: "" // Usa el estilo por defecto de la tarjeta si no tiene color asignado
        });
      }
    });

    return chips;
  }, [users]);

  return (
    <AppLayout>
      <div className="pg-wrap">
        {/* Encabezado */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Gestión de Usuarios</h1>
            <p className="pg-subtitle">Administra cuentas, roles y accesos del sistema</p>
          </div>
          <button className="btn-primary" onClick={() => setModal({ type: "create" })}>
            <Icon name="plus" /> Nuevo usuario
          </button>
        </div>
        
        {/* Chips resumen dinámicos */}
        {!loading && (
          <div className="um-summary-chips">
            {summaryChips.map(c => (
              <div key={c.id} className={`um-chip ${c.cls}`}>
                <span className="um-chip-val">{c.value}</span>
                <span className="um-chip-lbl">{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="pg-card um-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por nombre o correo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="um-filter-wrap">
            <span className="um-filter-label">Rol:</span>
            {["all", ...rolesList].map(r => (
              <button key={r}
                className={`um-filter-btn ${roleFilter === r ? "active" : ""}`}
                onClick={() => setRoleFilter(r)}>
                {r === "all" ? "Todos" : getRoleLabel(r)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="pg-card um-table-card">
          {loading ? (
            <div className="um-table-loading">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="um-sk-row">
                  <div className="sk" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div className="sk" style={{ width: "40%", height: 13 }} />
                    <div className="sk" style={{ width: "60%", height: 11 }} />
                  </div>
                  <div className="sk" style={{ width: 80, height: 22, borderRadius: 100 }} />
                  <div className="sk" style={{ width: 60, height: 22, borderRadius: 100 }} />
                  <div className="sk" style={{ width: 60, height: 28, borderRadius: 7 }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="pg-empty">No se encontraron usuarios con ese criterio.</div>
          ) : (
            <table className="um-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const uid = u.id || u.uid;
                  return (
                    <tr key={uid}>
                      <td>
                        <div className="um-user-cell">
                          <div className="um-avatar">{getInitials(u.name)}</div>
                          <span className="um-user-name">{u.name}</span>
                        </div>
                      </td>
                      <td className="um-email">{u.email}</td>
                      <td>
                        <select
                          className={`um-role-select role-badge ${roleColor[u.role] || "rb-default"}`}
                          value={u.role}
                          onChange={e => handleRoleChange(uid, e.target.value)}
                        >
                          {rolesList.map(r => (
                            <option key={r} value={r}>
                              {getRoleLabel(r)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge status-${u.status || "active"}`}>
                          {u.status === "inactive" ? "Inactivo" : "Activo"}
                        </span>
                      </td>
                      <td>
                        <div className="um-actions">
                          <button className="btn-icon" title="Editar"
                            onClick={() => setModal({ type: "edit", user: u })}>
                            <Icon name="edit" />
                          </button>
                          <button className="btn-icon danger" title="Eliminar"
                            onClick={() => setModal({ type: "delete", user: u })}>
                            <Icon name="trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modales */}
      {modal?.type === "create" && (
        <UserModal rolesList={rolesList} onClose={() => setModal(null)} onSaved={onSaved} />
      )}
      {modal?.type === "edit" && (
        <UserModal user={modal.user} rolesList={rolesList} onClose={() => setModal(null)} onSaved={onSaved} />
      )}
      {modal?.type === "delete" && (
        <DeleteModal user={modal.user} onClose={() => setModal(null)} onDeleted={onDeleted} />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}