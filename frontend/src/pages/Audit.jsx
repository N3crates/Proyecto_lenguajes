import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import "../styles/Audit.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const timeAgo = (val) => {
  if (!val) return "";
  const diff = Date.now() - new Date(val).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `Hace ${days}d`;
  return fmtDate(val);
};

// Colorea la acción según su prefijo
const actionMeta = (action = "") => {
  const a = action.toUpperCase();
  if (a.startsWith("CREATE") || a.startsWith("ADD"))    return { cls: "at-create", label: action };
  if (a.startsWith("UPDATE") || a.startsWith("EDIT"))   return { cls: "at-update", label: action };
  if (a.startsWith("DELETE") || a.startsWith("REMOVE")) return { cls: "at-delete", label: action };
  if (a.startsWith("LOGIN")  || a.startsWith("AUTH"))   return { cls: "at-auth",   label: action };
  return { cls: "at-default", label: action };
};

// Formatea el objeto details en texto legible
const fmtDetails = (details) => {
  if (!details || typeof details !== "object") return null;
  const entries = Object.entries(details);
  if (entries.length === 0) return null;
  return entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("  ·  ");
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkRow = () => (
  <tr className="au-sk-row">
    <td><div className="sk" style={{ width: "60%",  height: 12 }} /></td>
    <td><div className="sk" style={{ width: "80px", height: 22, borderRadius: 100 }} /></td>
    <td><div className="sk" style={{ width: "55%",  height: 12 }} /></td>
    <td><div className="sk" style={{ width: "40%",  height: 11 }} /></td>
    <td><div className="sk" style={{ width: "70px", height: 11 }} /></td>
  </tr>
);

// ── Modal: detalle de log ──────────────────────────────────────────────────────
function LogDetailModal({ log, onClose }) {
  const meta = actionMeta(log.action);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Detalle del registro</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="au-detail-grid">
          <div className="au-detail-row">
            <span className="au-detail-label">ID del log</span>
            <span className="au-detail-value mono">{log.id}</span>
          </div>
          <div className="au-detail-row">
            <span className="au-detail-label">Acción</span>
            <span className={`au-action-badge ${meta.cls}`}>{log.action}</span>
          </div>
          <div className="au-detail-row">
            <span className="au-detail-label">Usuario</span>
            <span className="au-detail-value">{log.userId || "Sistema"}</span>
          </div>
          <div className="au-detail-row">
            <span className="au-detail-label">Fecha y hora</span>
            <span className="au-detail-value">{fmtDate(log.timestamp)}</span>
          </div>
          {log.details && Object.keys(log.details).length > 0 && (
            <div className="au-detail-row au-detail-full">
              <span className="au-detail-label">Datos adicionales</span>
              <pre className="au-detail-pre">{JSON.stringify(log.details, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AuditPage() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all"); // all | create | update | delete | auth
  const [detail,  setDetail]  = useState(null);  // log seleccionado para modal

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("http://localhost:3000/api/audit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
        setLogs(json.data || []);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    fetchLogs();
  }, []);

  // Filtrado: búsqueda por acción o userId, + filtro por tipo
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter(log => {
      const matchSearch =
        log.action?.toLowerCase().includes(q) ||
        log.userId?.toLowerCase().includes(q);

      const a = (log.action || "").toUpperCase();
      const matchFilter =
        filter === "all"    ||
        (filter === "create" && (a.startsWith("CREATE") || a.startsWith("ADD")))    ||
        (filter === "update" && (a.startsWith("UPDATE") || a.startsWith("EDIT")))   ||
        (filter === "delete" && (a.startsWith("DELETE") || a.startsWith("REMOVE"))) ||
        (filter === "auth"   && (a.startsWith("LOGIN")  || a.startsWith("AUTH")));

      return matchSearch && matchFilter;
    });
  }, [logs, search, filter]);

  // Conteos para chips
  const counts = useMemo(() => ({
    total:  logs.length,
    create: logs.filter(l => { const a = (l.action||"").toUpperCase(); return a.startsWith("CREATE")||a.startsWith("ADD"); }).length,
    update: logs.filter(l => { const a = (l.action||"").toUpperCase(); return a.startsWith("UPDATE")||a.startsWith("EDIT"); }).length,
    delete: logs.filter(l => { const a = (l.action||"").toUpperCase(); return a.startsWith("DELETE")||a.startsWith("REMOVE"); }).length,
    auth:   logs.filter(l => { const a = (l.action||"").toUpperCase(); return a.startsWith("LOGIN")||a.startsWith("AUTH"); }).length,
  }), [logs]);

  const FILTERS = [
    { key: "all",    label: "Todos",     count: counts.total  },
    { key: "create", label: "Creación",  count: counts.create },
    { key: "update", label: "Edición",   count: counts.update },
    { key: "delete", label: "Eliminación",count: counts.delete },
    { key: "auth",   label: "Acceso",    count: counts.auth   },
  ];

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* Encabezado */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Auditoría</h1>
            <p className="pg-subtitle">Registro de las últimas 50 acciones en el sistema</p>
          </div>
          <button className="btn-ghost" onClick={() => { setLoading(true); setError(null);
            fetch("http://localhost:3000/api/audit", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
              .then(r => r.json()).then(j => setLogs(j.data || []))
              .catch(e => setError(e.message))
              .finally(() => setLoading(false));
          }}>
            <Icon name="refresh" /> Actualizar
          </button>
        </div>

        {/* Chips de conteo */}
        {!loading && !error && (
          <div className="au-chips">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`au-chip ${filter === f.key ? "active" : ""} au-chip-${f.key}`}
                onClick={() => setFilter(f.key)}
              >
                <span className="au-chip-val">{f.count}</span>
                <span className="au-chip-lbl">{f.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="pg-card au-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por acción o usuario…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => setSearch("")}>
              Limpiar
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="db-error-banner">⚠ {error}</div>
        )}

        {/* Tabla */}
        <div className="pg-card au-table-card">
          <table className="au-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Detalles</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(8).fill(0).map((_, i) => <SkRow key={i} />)
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="pg-empty">No se encontraron registros con ese criterio.</div>
                      </td>
                    </tr>
                  )
                  : filtered.map(log => {
                    const meta = actionMeta(log.action);
                    const det  = fmtDetails(log.details);
                    return (
                      <tr key={log.id} className="au-row" onClick={() => setDetail(log)}>
                        <td>
                          <div className="au-user-cell">
                            <div className="au-user-dot" />
                            <span className="au-user-id">{log.userId || "Sistema"}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`au-action-badge ${meta.cls}`}>{log.action}</span>
                        </td>
                        <td className="au-details-cell">
                          {det
                            ? <span className="au-details-text">{det}</span>
                            : <span className="au-details-empty">—</span>
                          }
                        </td>
                        <td className="au-date">{fmtDate(log.timestamp)}</td>
                        <td className="au-ago">{timeAgo(log.timestamp)}</td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <p className="au-footer-note">
            Mostrando {filtered.length} de {logs.length} registros · Haz clic en una fila para ver el detalle completo
          </p>
        )}
      </div>

      {detail && <LogDetailModal log={detail} onClose={() => setDetail(null)} />}
    </AppLayout>
  );
}