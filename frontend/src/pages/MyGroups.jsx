import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

const ITEMS_PER_PAGE = 8;

export default function MyGroups() {
  // Estados principales
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Usuario logueado desde localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Funcion para obtener el perfil del docente y sus grupos
  const fetchAll = async () => {
    try {
      setLoading(true);

      // 1. Obtener el perfil de docente usando el userId del login
      const teacherRes = await api.get(`/teachers/by-user/${user.id}`);
      const teacher = teacherRes.data.data;

      // 2. Obtener los grupos del docente y las materias 
      const [groupsRes, subjectsRes] = await Promise.all([
        api.get(`/groups/teacher/${teacher.id}`),
        api.get("/subjects"),
      ]);

      setGroups(groupsRes.data.data);
      setSubjects(subjectsRes.data.data);
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

  return (
    <AppLayout>
      <div className="pg-wrap">

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

        {/* Tabla de grupos asignados */}
        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Materia</th>
                <th>Ciclo</th>
                <th>Descripcion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="module-loading">Cargando...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="5" className="module-empty">No tienes grupos asignados</td></tr>
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