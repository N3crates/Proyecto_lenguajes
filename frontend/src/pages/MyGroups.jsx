import { useState, useEffect, useMemo } from "react";
import AppLayout, { Icon } from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

const ITEMS_PER_PAGE = 8;

export default function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchAll = async () => {
    try {
      setLoading(true);

      // 1. Obtener el perfil de docente usando el userId del login
      const teacherRes = await api.get(`/teachers/by-user/${user.id}`);
      const teacher = teacherRes.data.data;

      // 2. Obtener los grupos de ese docente y las materias en paralelo
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, []);

  const getSubjectName = (id) => {
    const s = subjects.find(s => s.id === id);
    return s ? s.nombre : "—";
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return groups.filter(g =>
      g.nombre?.toLowerCase().includes(q) ||
      g.ciclo?.toLowerCase().includes(q) ||
      getSubjectName(g.subjectId).toLowerCase().includes(q)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, search, subjects]);

  const totalPages = Math.max(Math.ceil(filtered.length / ITEMS_PER_PAGE), 1);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  return (
    <AppLayout>
      <div className="pg-wrap">

        {/* Header */}
        <div className="pg-head">
          <div>
            <h1 className="pg-title">Mis Grupos</h1>
            <p className="pg-subtitle">Grupos asignados a tu perfil docente</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="pg-card module-toolbar">
          <div className="um-search-wrap">
            <Icon name="search" />
            <input
              className="um-search-input"
              placeholder="Buscar por nombre, materia o ciclo…"
              value={search}
              onChange={handleSearch}
            />
          </div>
          {search && (
            <button className="btn-ghost" onClick={() => { setSearch(""); setPage(1); }}>Limpiar</button>
          )}
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* Tabla */}
        <div className="pg-card module-table-card">
          <table className="module-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Materia</th>
                <th>Ciclo</th>
                <th>Descripción</th>
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

        {/* Paginación */}
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

        {!loading && filtered.length > 0 && (
          <p style={{ fontSize: 12.5, color: "var(--text-2)", textAlign: "center" }}>
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} grupos
          </p>
        )}

      </div>
    </AppLayout>
  );
}