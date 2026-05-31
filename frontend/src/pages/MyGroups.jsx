import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

const ITEMS_PER_PAGE = 8;

// Modal de alumnos inscritos en un grupo
function AlumnosModal({ group, enrollments, loading, getStudentName, getSubjectName, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">👥 Alumnos inscritos — {group.nombre}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12.5, color: "var(--text-2)", margin: 0 }}>
            Materia: <strong>{getSubjectName(group.subjectId)}</strong> · Ciclo: <strong>{group.ciclo}</strong> · Total inscritos: <strong>{enrollments.length}</strong>
          </p>
        </div>

        {loading ? (
          <p className="module-loading">Cargando alumnos...</p>
        ) : enrollments.length === 0 ? (
          <p className="module-empty">No hay alumnos inscritos en este grupo</p>
        ) : (
          <table className="module-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Alumno</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={enrollment.id}>
                  <td>{index + 1}</td>
                  <td>{getStudentName(enrollment.studentId)}</td>
                  <td>
                    <span className={enrollment.status ? "badge-active" : "badge-inactive"}>
                      {enrollment.status ? "Activo" : "Baja"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function MyGroups() {
  // Estados principales
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Estados para el modal de alumnos inscritos
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Usuario logueado desde localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Funcion para obtener el perfil del docente, sus grupos, materias y alumnos
  const fetchAll = async () => {
    try {
      setLoading(true);

      // 1. Obtener el perfil de docente usando el userId del login
      const teacherRes = await api.get(`/teachers/by-user/${user.id}`);
      const teacher = teacherRes.data.data;

      // 2. Obtener grupos, materias y alumnos en paralelo
      const [groupsRes, subjectsRes, studentsRes] = await Promise.all([
        api.get(`/groups/teacher/${teacher.id}`),
        api.get("/subjects"),
        api.get("/students"),
      ]);

      setGroups(groupsRes.data.data);
      setSubjects(subjectsRes.data.data);
      setStudents(studentsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar el componente
  useEffect(() => {
    const load = async () => { await fetchAll(); };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper para obtener el nombre de la materia por id
  const getSubjectName = (id) => {
    const s = subjects?.find(s => s.id === id);
    return s ? s.nombre : "—";
  };

  // Helper para obtener el nombre del alumno por id
  const getStudentName = (id) => {
    const s = students.find(s => s.id === id);
    if (!s) return id;
    return s.name || id;
  };

  // Filtro por busqueda de texto
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return groups.filter(g =>
      g.nombre?.toLowerCase().includes(q) ||
      g.ciclo?.toLowerCase().includes(q) ||
      getSubjectName(g.subjectId).toLowerCase().includes(q)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, search, subjects]);

  // Calculo de paginacion
  const totalPages = Math.max(Math.ceil(filtered.length / ITEMS_PER_PAGE), 1);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  // Total de grupos activos para el banner
  const activeGroups = groups.filter(g => g.status).length;

  // Abrir modal de alumnos inscritos
  const handleVerAlumnos = async (group) => {
    try {
      setSelectedGroup(group);
      setLoadingEnrollments(true);
      const res = await api.get(`/enrollments/group/${group.id}`);
      setEnrollments(res.data.data);
    } catch (err) {
      setEnrollments([]);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* Modal de alumnos inscritos */}
        {selectedGroup && (
          <AlumnosModal
            group={selectedGroup}
            enrollments={enrollments}
            loading={loadingEnrollments}
            getStudentName={getStudentName}
            getSubjectName={getSubjectName}
            onClose={() => { setSelectedGroup(null); setEnrollments([]); }}
          />
        )}

        {/* Encabezado de la pagina */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Mis Grupos</h1>
            <p className="pg-subtitle">Grupos asignados a tu perfil docente</p>
          </div>
        </div>

        {/* Banner de bienvenida */}
        {!loading && (
          <div className="db-widget g-indigo" style={{ padding: "20px 28px", display: "flex", alignItems: "center", gap: 14, borderRadius: "var(--radius)", marginBottom: 0 }}>
            <span style={{ fontSize: 32 }}>👨‍🏫</span>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>
                Bienvenido, {user.name}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
                Tienes <strong>{activeGroups}</strong> grupo{activeGroups !== 1 ? "s" : ""} activo{activeGroups !== 1 ? "s" : ""} asignado{activeGroups !== 1 ? "s" : ""} este ciclo.
              </p>
            </div>
          </div>
        )}

        {/* Buscador por nombre, materia o ciclo */}
        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por nombre, materia o ciclo..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => { setSearch(""); setPage(1); }}>Limpiar</button>
          )}
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Tabla de grupos asignados — solo lectura */}
        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Materia</th>
                <th>Ciclo</th>
                <th>Descripcion</th>
                <th>Status</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="module-loading">Cargando...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="6" className="module-empty">No tienes grupos asignados</td></tr>
              ) : (
                paginated.map((group) => (
                  <tr key={group.id}>
                    <td>{group.nombre}</td>
                    <td>{getSubjectName(group.subjectId)}</td>
                    <td>{group.ciclo}</td>
                    <td>{group.descripcion || "—"}</td>
                    <td>
                      <span className={group.status ? "badge-active" : "badge-inactive"}>
                        {group.status ? "Activo" : "Baja"}
                      </span>
                    </td>
                    <td>
                      {/* Boton para ver alumnos inscritos */}
                      <button className="module-btn-edit" onClick={() => handleVerAlumnos(group)}>
                         Alumnos
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginacion */}
        {!loading && filtered.length > ITEMS_PER_PAGE && (
          <div className="module-pagination">
            <button className="page-btn" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              ← Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`page-btn ${page === n ? "active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Siguiente →
            </button>
          </div>
        )}

        {/* Contador de resultados */}
        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 12.5, color: "var(--text-2)", textAlign: "center" }}>
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} grupos
          </p>
        )}

      </div>
    </AppLayout>
  );
}