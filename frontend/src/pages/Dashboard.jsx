import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout, { Icon } from "../components/layout/Applayout";
import "../styles/Dashboard.css";


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
            {/*<span className="db-notif-badge" />*/}
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