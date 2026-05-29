import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import "../styles/Roles.css";

const ROLE_META = {
  admin:   { label: "Administrador", color: "rm-red",    icon: "shield" },
  teacher: { label: "Docente",       color: "rm-indigo", icon: "book"   },
  student: { label: "Estudiante",    color: "rm-teal",   icon: "star"   },
};
const getMeta = (name) =>
  ROLE_META[name] || { label: name.charAt(0).toUpperCase() + name.slice(1), color: "rm-slate", icon: "tag" };

const PERM_LABELS = {
  //"view_dashboard":  "Ver Dashboard",
  "manage_users":    "Gestionar Usuarios",
  "manage_roles":    "Gestionar Roles",
  "manage_teachers":    "Gestionar Docentes",
  "manage_groups":   "Gestionar Grupos",
  "view_grades":     "Ver Calificaciones",
  "manage_students": "Gestionar Alumnos",
  "manage_enrollments": "Gestionar Inscripciones",
  "manage_subjects":    "Gestionar Materias", 
  "view_own_grades": "Ver Mis Calificaciones",
  "view_own_groups": "Ver Mis Grupos",
  //"view_enrollments":   "Ver Mis Inscripciones",
};
const permLabel = (p) => PERM_LABELS[p] || p;

const normalizePerms = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Object.entries(raw).filter(([, v]) => v).map(([k]) => k);
};

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "U";

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`pg-toast ${type}`}>{msg}</div>;
}

// ── Modal: Crear rol ──────────────────────────────────────────────────────────
function CreateRoleModal({ onClose, onSaved }) {
  const ALL_PERMS = Object.keys(PERM_LABELS);
  const [form, setForm]       = useState({ name: "", description: "", permissions: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const togglePerm = (p) =>
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(p)
        ? f.permissions.filter(x => x !== p)
        : [...f.permissions, p],
    }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim()) return setError("El nombre del rol es obligatorio.");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name:        form.name.trim().toLowerCase().replace(/\s+/g, "_"),
          description: form.description.trim(),
          permissions: form.permissions,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error al crear rol");
      onSaved(json.data || json.role || json);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Nuevo rol</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-field">
          <label className="modal-label">Nombre del rol</label>
          <input className="pg-input" placeholder="Ej. coordinator"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <span className="rm-hint">Minúsculas sin espacios. Ej: coordinator, prefect</span>
        </div>
        <div className="modal-field">
          <label className="modal-label">Descripción</label>
          <input className="pg-input" placeholder="Breve descripción del rol"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="modal-field">
          <label className="modal-label">Permisos</label>
          <div className="rm-perm-grid">
            {ALL_PERMS.map(p => (
              <label key={p} className={`rm-perm-check ${form.permissions.includes(p) ? "checked" : ""}`}>
                <input type="checkbox" checked={form.permissions.includes(p)}
                  onChange={() => togglePerm(p)} style={{ display: "none" }} />
                <span className="rm-perm-box" />
                {permLabel(p)}
              </label>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creando…" : "Crear rol"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Editar permisos ────────────────────────────────────────────────────
function EditPermsModal({ role, onClose, onSaved }) {
  const ALL_PERMS = Object.keys(PERM_LABELS);
  const [perms, setPerms]     = useState(normalizePerms(role.permissions));
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const toggle = (p) =>
    setPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleSave = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/roles/${role.id || role.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ permissions: perms }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error al guardar permisos");
      onSaved({ ...role, permissions: perms });
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Editar permisos — {getMeta(role.name).label}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="modal-error">{error}</div>}
        <p className="rm-modal-desc">Selecciona los módulos a los que tendrá acceso este rol.</p>
        <div className="rm-perm-grid">
          {ALL_PERMS.map(p => (
            <label key={p} className={`rm-perm-check ${perms.includes(p) ? "checked" : ""}`}>
              <input type="checkbox" checked={perms.includes(p)}
                onChange={() => toggle(p)} style={{ display: "none" }} />
              <span className="rm-perm-box" />
              {permLabel(p)}
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando…" : "Guardar permisos"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Eliminar rol ───────────────────────────────────────────────────────
function DeleteRoleModal({ role, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/roles/${role.id || role.uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error al eliminar");
      onDeleted(role.id || role.uid);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Eliminar rol</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="um-confirm-text">
          ¿Estás seguro de eliminar el rol <strong>{getMeta(role.name).label}</strong>?<br />
          Los usuarios con este rol podrían perder accesos. Esta acción no se puede deshacer.
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

// ── Panel inline de usuarios ──────────────────────────────────────────────────
function UsersPanel({ roleName, users, onClose }) {
  const meta    = getMeta(roleName);
  const members = users.filter(u => u.role === roleName);

  return (
    <div className="rm-inline-panel">
      <div className="rm-panel-header">
        <span className="rm-panel-title">
          <span className={`rm-panel-dot ${meta.color}`} />
          Usuarios — {meta.label}
        </span>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>

      {members.length === 0 ? (
        <p className="pg-empty" style={{ padding: "20px 20px" }}>
          Ningún usuario con este rol.
        </p>
      ) : (
        <ul className="rm-user-list">
          {members.map(u => (
            <li key={u.id || u.uid} className="rm-user-item">
              <div className="rm-u-avatar">{getInitials(u.name)}</div>
              <div className="rm-u-info">
                <span className="rm-u-name">{u.name}</span>
                <span className="rm-u-email">{u.email}</span>
              </div>
              <span className={`status-badge status-${u.status || "active"}`}>
                {u.status === "inactive" ? "Inactivo" : "Activo"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function RolesPage() {
  const [roles, setRoles]     = useState([]);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState(null);
  const [openPanel, setOpenPanel] = useState(null); // nombre del rol con panel abierto

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:3000/api/roles", { headers }).then(r => r.json()),
      fetch("http://localhost:3000/api/users", { headers }).then(r => r.json()),
    ]).then(([rj, uj]) => {
      const dbRoles = rj.data || rj.roles || rj || [];
      const dbUsers = uj.data || uj.users || uj || [];

      const defaultRoles = [
        { name: "admin",   description: "Acceso total al sistema",                      permissions: Object.keys(PERM_LABELS) },
        { name: "teacher", description: "Gestión de grupos y calificaciones",           permissions: ["view_dashboard", "view_own_groups", "manage_grades"] },
        { name: "student", description: "Consulta de estatus y calificaciones",         permissions: ["view_own_grades"] },
      ];

      const merged = [...defaultRoles];
      dbRoles.forEach(dbRole => {
        const idx = merged.findIndex(r => r.name === dbRole.name);
        if (idx >= 0) merged[idx] = dbRole;
        else merged.push(dbRole);
      });

      setRoles(merged);
      setUsers(dbUsers);
    }).catch(e => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const countByRole = useMemo(() =>
    users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {}),
  [users]);

  const onCreated      = (r)  => { setRoles(prev => [...prev, r]); showToast("Rol creado correctamente."); };
  const onPermsUpdated = (r)  => { setRoles(prev => prev.map(x => (x.id || x.uid) === (r.id || r.uid) ? r : x)); showToast("Permisos actualizados."); };
  const onRoleDeleted  = (id) => { setRoles(prev => prev.filter(r => (r.id || r.uid) !== id)); showToast("Rol eliminado."); };

  const togglePanel = (name) => setOpenPanel(prev => prev === name ? null : name);

  return (
    <AppLayout>
      <div className="pg-wrap">
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Roles y Permisos</h1>
            <p className="pg-subtitle">Roles del sistema, permisos asignados y usuarios por rol</p>
          </div>
          <button className="btn-primary" onClick={() => setModal({ type: "create" })}>
            <Icon name="plus" /> Crear rol
          </button>
        </div>

        {/* Lista de tarjetas — cada una puede expandir su panel al lado */}
        <div className="rm-cards-col">
          {loading
            ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="pg-card rm-role-card rm-sk">
                  <div className="sk" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="sk" style={{ width: "40%", height: 16 }} />
                    <div className="sk" style={{ width: "75%", height: 12 }} />
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      {[0,1,2].map(j => <div key={j} className="sk" style={{ width: 70, height: 22, borderRadius: 100 }} />)}
                    </div>
                  </div>
                </div>
              ))
            : roles.map(role => {
                const name          = role.name;
                const meta          = getMeta(name);
                const count         = countByRole[name] || 0;
                const perms         = normalizePerms(role.permissions);
                const isOpen        = openPanel === name;
                const isDefaultRole = ["admin", "teacher", "student"].includes(name);

                return (
                  // Wrapper que pone tarjeta + panel en fila cuando está abierto
                  <div key={role.id || name} className={`rm-row-wrap ${isOpen ? "rm-row-open" : ""}`}>

                    {/* Tarjeta del rol */}
                    <div className={`pg-card rm-role-card ${isOpen ? "rm-selected" : ""}`}>
                      <div className={`rm-icon-wrap ${meta.color}`}>
                        <Icon name={meta.icon} />
                      </div>

                      <div className="rm-body">
                        <div className="rm-top">
                          <span className="rm-role-name">{meta.label}</span>
                          <code className="rm-role-key">{name}</code>
                        </div>

                        {role.description && <p className="rm-desc">{role.description}</p>}

                        {perms.length > 0 ? (
                          <div className="rm-perms">
                            {perms.map(p => (
                              <span key={p} className={`rm-perm-tag ${meta.color}`}>{permLabel(p)}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="rm-no-perms">Sin permisos definidos.</p>
                        )}

                        <div className="rm-footer">
                          <span className="rm-count">
                            <Icon name="users" />
                            <strong>{count}</strong>{count === 1 ? " usuario" : " usuarios"}
                          </span>
                          <div className="rm-footer-btns">
                            {!isDefaultRole && (
                              <button className="btn-icon danger" title="Eliminar rol"
                                onClick={() => setModal({ type: "deleteRole", role })}>
                                <Icon name="trash" />
                              </button>
                            )}
                            <button className="btn-icon" title="Editar permisos"
                              onClick={() => setModal({ type: "editPerms", role })}>
                              <Icon name="edit" />
                            </button>
                            <button
                              className={`btn-ghost rm-view-btn ${isOpen ? "active" : ""}`}
                              onClick={() => togglePanel(name)}>
                              {isOpen ? "Ocultar" : "Ver usuarios"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Panel de usuarios — aparece al lado cuando está abierto */}
                    {isOpen && (
                      <UsersPanel
                        roleName={name}
                        users={users}
                        onClose={() => setOpenPanel(null)}
                      />
                    )}
                  </div>
                );
              })}
        </div>
      </div>

      {modal?.type === "create"     && <CreateRoleModal onClose={() => setModal(null)} onSaved={onCreated} />}
      {modal?.type === "editPerms"  && <EditPermsModal  role={modal.role} onClose={() => setModal(null)} onSaved={onPermsUpdated} />}
      {modal?.type === "deleteRole" && <DeleteRoleModal role={modal.role} onClose={() => setModal(null)} onDeleted={onRoleDeleted} />}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}