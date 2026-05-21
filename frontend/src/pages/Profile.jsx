import { useState, useEffect } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import "../styles/Profile.css";

// ─── Constantes ───────────────────────────────────────────────────────────────
const roleLabel = { admin: "Administrador", teacher: "Docente", student: "Estudiante" };
const roleColor = { admin: "rb-admin", teacher: "rb-teacher", student: "rb-student" };

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "U";

const fmt = (val) => {
  if (!val) return "—";
  
  let d;
  // Si viene de Firestore convertido a JSON (con _seconds)
  if (val._seconds) {
    d = new Date(val._seconds * 1000);
  } 
  // Si es un Timestamp nativo de Firebase
  else if (val.toDate) {
    d = val.toDate();
  } 
  // Si es un string o fecha estándar
  else {
    d = new Date(val);
  }

  // Verificar si la fecha es válida antes de formatear
  if (isNaN(d.getTime())) return "—";
  
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
};

// ─── InfoRow declarado FUERA del componente (evita el error de React) ─────────
const InfoRow = ({ label, value, mono }) => (
  <div className="pf-info-row">
    <span className="pf-info-label">{label}</span>
    <span className={`pf-info-value ${mono ? "mono" : ""}`}>{value || "—"}</span>
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`pg-toast ${type}`}>{msg}</div>;
};

// ── Modal: Cambiar contraseña ─────────────────────────────────────────────────
const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm]       = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!form.currentPassword || !form.newPassword || !form.confirm)
      return setError("Completa todos los campos.");
    if (form.newPassword.length < 6)
      return setError("La nueva contraseña debe tener mínimo 6 caracteres.");
    if (form.newPassword !== form.confirm)
      return setError("Las contraseñas nuevas no coinciden.");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("http://localhost:3000/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error al cambiar contraseña");
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Cambiar contraseña</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error   && <div className="modal-error">{error}</div>}
        {success && <div className="modal-success">✓ Contraseña actualizada correctamente.</div>}
        {!success && (
          <>
            <div className="modal-field">
              <label className="modal-label">Contraseña actual</label>
              <input type="password" className="pg-input" placeholder="••••••••"
                value={form.currentPassword}
                onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Nueva contraseña</label>
              <input type="password" className="pg-input" placeholder="Mínimo 6 caracteres"
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })} />
            </div>
            <div className="modal-field">
              <label className="modal-label">Confirmar nueva contraseña</label>
              <input type="password" className="pg-input" placeholder="Repite la contraseña"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={onClose}>Cancelar</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Guardando…" : "Actualizar contraseña"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Modal: Editar nombre ──────────────────────────────────────────────────────
const EditNameModal = ({ currentName, uid, onClose, onSaved }) => {
  const [name, setName]       = useState(currentName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) return setError("El nombre no puede estar vacío.");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`http://localhost:3000/api/users/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Error al actualizar nombre");
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: name.trim() }));
      onSaved(name.trim());
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Editar perfil</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-field">
          <label className="modal-label">Nombre completo</label>
          <input type="text" className="pg-input" placeholder="Tu nombre"
            value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // "password" | "edit"
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setProfile(json.data || json.user || json);
      } catch (e) {
        showToast(e.message, "error");
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleNameSaved = (newName) => {
    setProfile(p => ({ ...p, name: newName }));
    showToast("Nombre actualizado correctamente.");
  };

  return (
    <AppLayout>
      <div className="pg-wrap">

        <div className="pg-head">
          <div>
            <h1 className="pg-title">Mi Perfil</h1>
            <p className="pg-subtitle">Información y configuración de tu cuenta</p>
          </div>
        </div>

        {loading ? (
          <div className="pf-skeleton-wrap">
            <div className="pg-card pf-hero-card">
              <div className="sk" style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 16 }} />
              <div className="sk" style={{ width: 160, height: 20, marginBottom: 8 }} />
              <div className="sk" style={{ width: 90,  height: 16 }} />
            </div>
          </div>
        ) : (
          <div className="pf-layout">

            {/* Tarjeta de identidad */}
            <div className="pg-card pf-hero-card">
              <div className="pf-avatar-wrap">
                <div className="pf-avatar">{getInitials(profile?.name)}</div>
                <div className={`pf-avatar-ring ${roleColor[profile?.role]}`} />
              </div>
              <h2 className="pf-name">{profile?.name || "Usuario sin nombre"}</h2>
              <span className={`role-badge ${roleColor[profile?.role]}`}>
                {roleLabel[profile?.role] || profile?.role}
              </span>
              <span
                className={`status-badge status-${profile?.status || "active"}`}
                style={{ marginTop: 8 }}
              >
                {profile?.status === "active" ? "Cuenta activa" : "Inactivo"}
              </span>
              <div className="pf-actions">
                <button className="btn-primary" onClick={() => setModal("edit")}>
                  <Icon name="edit" /> Editar nombre
                </button>
                <button className="btn-ghost" onClick={() => setModal("password")}>
                  <Icon name="lock" /> Cambiar contraseña
                </button>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="pf-right">

              <div className="pg-card pf-info-card">
                <div className="pf-section-title">
                  <Icon name="user" /> Datos de cuenta
                </div>
                <div className="pf-info-list">
                  <InfoRow label="Nombre completo" value={profile?.name || "Aún no registrado"} />
                  <InfoRow label="Correo electrónico" value={profile?.email} />
                  <InfoRow label="Rol" value={roleLabel[profile?.role] || profile?.role} />
                  <InfoRow label="Miembro desde" value={fmt(profile?.createdAt || profile?.metadata?.creationTime)} />
                </div>
              </div>

              <div className="pg-card pf-info-card">
                <div className="pf-section-title">
                  <Icon name="shield" /> Información del sistema
                </div>
                <div className="pf-info-list">
                  <InfoRow label="ID de usuario"  value={profile?.uid || profile?.id} mono />
                  <InfoRow label="Estado"         value={profile?.status === "active" ? "Activa" : "Inactiva"} />
                  <InfoRow label="Tipo de acceso" value={roleLabel[profile?.role] || "—"} />
                </div>
                <div className="pf-note">
                  El correo electrónico no puede modificarse por políticas de la institución.
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {modal === "password" && (
        <ChangePasswordModal onClose={() => setModal(null)} />
      )}
      {modal === "edit" && profile && (
        <EditNameModal
          currentName={profile.name}
          uid={profile.uid || profile.id}
          onClose={() => setModal(null)}
          onSaved={handleNameSaved}
        />
      )}

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </AppLayout>
  );
}