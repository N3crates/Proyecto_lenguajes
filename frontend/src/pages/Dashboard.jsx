import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/Applayout";
import "../styles/Dashboard.css";


// ─── Íconos SVG ──────────────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    clipboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
    book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    tag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  };
  return <span className="nav-icon">{icons[name] || null}</span>;
};

// ─── Navegación por rol (solo rutas con endpoint real) ────────────────────────
const navByRole = {
  admin: [
    { label: "Inicio",           icon: "home",      section: null, path: "/dashboard" },
    { label: "Mi Perfil",        icon: "user",      section: null, path: "/profile" }, 
    { label: "Usuarios",         icon: "users",     section: "Administración", path: "/users" }, 
    { label: "Roles y Permisos", icon: "shield",    section: "Administración", path: "/roles" },
    { label: "Auditoría",        icon: "clipboard", section: "Administración", path: "/audit" }, 
    { label: "Docentes",         icon: "user",      section: "Escolar", path: "/teachers" }, 
    { label: "Alumnos",          icon: "users",     section: "Escolar", path: "/students" }, 
    { label: "Inscripción",      icon: "clipboard", section: "Escolar", path: "/enrollments"},
    { label: "Calificaciones",   icon: "star",      section: "Académico", path: "/grades"},
    { label: "Materias",         icon: "book",      section: "Académico", path: "/subjects" }, 
    { label: "Grupos",           icon: "book",      section: "Académico", path: "/groups" }, 
    { label: "Calificaciones",   icon: "star",      section: "Académico", path: "/grades" }, 
  ],
  teacher: [
    { label: "Inicio",         icon: "home",      section: null, path: "/dashboard" },
    { label: "Mi Perfil",      icon: "user",      section: null, path: "/profile" },
    { label: "Mis Grupos",     icon: "book",      section: "Académico", path: "/groups/my-groups" },
    { label: "Calificaciones", icon: "star",      section: "Académico", path: "/grades/capture" },
  ],
  student: [
    { label: "Inicio",             icon: "home",      section: null, path: "/dashboard" },
    { label: "Mi Perfil",          icon: "user",      section: null, path: "/profile" },
    { label: "Mis Calificaciones", icon: "star",      section: "Escolar", path: "/my-grades" },
    { label: "Mis Inscripciones",  icon: "book",      section: "Escolar", path: "/enrollments" },
  ],
};


// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
};

const formatDate = (dateVal) => {
  try {
    const d    = new Date(dateVal);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "Ahora";
    if (mins < 60) return `Hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `Hace ${hrs}h`;
    return `Hace ${Math.floor(hrs / 24)}d`;
  } catch { return ""; }
};

// ─── Widgets por rol (datos vienen del backend) ───────────────────────────────
const buildWidgets = (stats, role) => {
  if (!stats) return [];
  if (role === "admin") return [
    { label: "Usuarios Totales", value: stats.totalUsers,              sub: "Registrados en el sistema",  grad: "g-indigo", icon: "users"    },
    { label: "Docentes",         value: stats.totalTeachers,           sub: "Activos este ciclo",          grad: "g-violet", icon: "user"     },
    { label: "Alumnos",          value: stats.totalStudents,           sub: "Activos este ciclo",          grad: "g-teal",   icon: "book"     },
    { label: "Grupos",           value: stats.totalGroups,             sub: "Grupos registrados",          grad: "g-amber",  icon: "calendar" },
    { label: "Roles",            value: stats.totalRoles,              sub: "Perfiles de acceso",          grad: "g-slate",  icon: "shield"   },
    { label: "Promedio General", value: stats.generalAverage || "—",   sub: "Calificación escuela",        grad: "g-rose",   icon: "star"     },
  ];
  if (role === "teacher") return [
    { label: "Grupos Activos",   value: stats.totalGroups,             sub: "Este ciclo",                  grad: "g-indigo", icon: "book"     },
    { label: "Alumnos",          value: stats.totalStudents,           sub: "Total del plantel",            grad: "g-teal",   icon: "users"    },
    { label: "Promedio Escuela", value: stats.generalAverage || "—",   sub: "Promedio global",              grad: "g-violet", icon: "star"     },
  ];
  return [
    { label: "Promedio General", value: stats.generalAverage || "—",   sub: "Promedio del plantel",        grad: "g-indigo", icon: "star"     },
    { label: "Grupos Activos",   value: stats.totalGroups,             sub: "Este ciclo",                  grad: "g-teal",   icon: "book"     },
  ];
};

// ─── Accesos rápidos por rol ──────────────────────────────────────────────────
const quickByRole = {
  admin:   [
    { label: "Usuarios",         icon: "users",     path: "/users"     },
    { label: "Roles y Permisos", icon: "shield",    path: "/roles"     },
    { label: "Auditoría",        icon: "clipboard", path: "/audit"     },
    { label: "Calificaciones",   icon: "star",      path: "/grades"    },
  ],
  teacher: [
    { label: "Mis Grupos",       icon: "book",      path: "/groups/my-groups"  },
    { label: "Calificaciones",   icon: "star",      path: "/grades/capture"    },
  ],
  student: [
    { label: "Mis Calificaciones", icon: "star",    path: "/my-grades"         },
    { label: "Mis Inscripciones",  icon: "book",    path: "/enrollments"       },
  ],
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="sk-card">
    <div className="sk-line sk-short" />
    <div className="sk-line sk-tall"  />
    <div className="sk-line sk-medium"/>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate   = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const user       = storedUser || { name: "Usuario", role: "student" };

  const [stats,    setStats]    = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch("http://localhost:3000/api/dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success) {
          setStats(json.data.stats);
          setActivity(json.data.recentActivity || []);
        } else {
          throw new Error(json.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const widgets = buildWidgets(stats, user.role);
  const quick   = quickByRole[user.role] || [];

  return (
    <AppLayout>
      <div className="db-page">

        {/* ── Topbar ── */}
        <header className="db-topbar">
          <div>
            <h1 className="db-greeting">
              {getGreeting()}, <strong>{user.name}</strong> 👋
            </h1>
            <p className="db-subgreeting">
              {new Date().toLocaleDateString("es-MX", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <button className="db-bell-btn">
            <Icon name="bell" />
            <span className="db-notif-badge" />
          </button>
        </header>

        {/* ── Error ── */}
        {error && (
          <div className="db-error-banner">
            ⚠ No se pudo cargar el resumen: {error}
          </div>
        )}

        {/* ── Widgets ── */}
        <section className="db-widgets">
          {loading
            ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : widgets.map(w => (
                <div key={w.label} className={`db-widget ${w.grad}`}>
                  <div className="db-widget-top">
                    <span className="db-widget-icon"><Icon name={w.icon} /></span>
                  </div>
                  <p className="db-widget-value">{w.value}</p>
                  <p className="db-widget-label">{w.label}</p>
                  <p className="db-widget-sub">{w.sub}</p>
                </div>
              ))
          }
        </section>

        {/* ── Panel inferior ── */}
        <div className="db-lower">

          {/* Actividad reciente */}
          <div className="db-card">
            <div className="db-card-header">
              <span className="db-card-icon"><Icon name="activity" /></span>
              <h2>Actividad Reciente</h2>
            </div>

            {loading ? (
              <div className="db-activity-list">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="db-activity-item">
                    <div className="sk-dot" />
                    <div className="sk-line sk-grow" />
                    <div className="sk-line sk-time" />
                  </div>
                ))}
              </div>
            ) : activity.length === 0 ? (
              <p className="db-empty">Sin actividad reciente.</p>
            ) : (
              <ul className="db-activity-list">
                {activity.map(a => (
                  <li key={a.id} className="db-activity-item">
                    <span className="db-act-dot" />
                    <div className="db-act-body">
                      <span className="db-act-action">{a.action}</span>
                      <span className="db-act-user">por {a.user}</span>
                    </div>
                    <span className="db-act-time">{formatDate(a.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accesos rápidos */}
          <div className="db-card db-quick-card">
            <div className="db-card-header">
              <span className="db-card-icon"><Icon name="tag" /></span>
              <h2>Accesos Rápidos</h2>
            </div>
            <div className="db-quick-grid">
              {quick.map(item => (
                <button
                  key={item.path}
                  className="db-quick-btn"
                  onClick={() => navigate(item.path)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}