import { useState, useEffect, useMemo } from "react";
import AppLayout from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Grades() {

  const [grades, setGrades] =
    useState([]);

  const [enrollments,
    setEnrollments] =
      useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingGrade,
    setEditingGrade] =
      useState(null);


  const [form, setForm] =
    useState({

      enrollmentId: "",

      partial1: "",
      partial2: "",
      partial3: ""

    });


  // =====================================
  // FETCH GRADES
  // =====================================

  const fetchGrades =
  async () => {

    try {

      setLoading(true);

      const res =
        await api.get(
          "/grades"
        );

      setGrades(
        res.data.data
      );

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // FETCH ENROLLMENTS
  // =====================================

  const fetchEnrollments =
  async () => {

    try {

      const res =
        await api.get(
          "/enrollments"
        );

      setEnrollments(
        res.data.data
      );

    } catch (err) {

      console.log(err);

    }

  };


  useEffect(() => {

    fetchGrades();

    fetchEnrollments();

  }, []);


  // =====================================
  // FILTER
  // =====================================

  const filtered = useMemo(() => {

    const q =
      search.toLowerCase();

    return grades.filter(
      grade => {

        const enrollment =
          enrollments.find(

            e => e.id ===
            grade.enrollmentId

          );

        if(!enrollment)
          return false;

        return (

          enrollment.studentId
            ?.toLowerCase()
            .includes(q)

          ||

          enrollment.subjectId
            ?.toLowerCase()
            .includes(q)

        );

      }
    );

  }, [grades, enrollments, search]);


  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };


  // =====================================
  // HANDLE SUBMIT
  // =====================================

  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      if(editingGrade){

        await api.put(

          `/grades/${editingGrade.id}`,

          form

        );

      } else {

        await api.post(

          "/grades",

          form

        );

      }

      setShowForm(false);

      setEditingGrade(
        null
      );

      setForm({

        enrollmentId: "",

        partial1: "",
        partial2: "",
        partial3: ""

      });

      fetchGrades();

    } catch (err) {

      alert(

        err.response?.data?.message ||

        "Error al guardar calificación"

      );

    }

  };


  // =====================================
  // HANDLE EDIT
  // =====================================

  const handleEdit =
  (grade) => {

    setEditingGrade(
      grade
    );

    setForm({

      enrollmentId:
        grade.enrollmentId || "",

      partial1:
        grade.partial1 || "",

      partial2:
        grade.partial2 || "",

      partial3:
        grade.partial3 || ""

    });

    setShowForm(true);

  };


  // =====================================
  // HANDLE DELETE
  // =====================================

  const handleDelete =
  async (id) => {

    if(
      !confirm(
        "¿Dar de baja esta calificación?"
      )
    ) return;

    try {

      await api.delete(
        `/grades/${id}`
      );

      fetchGrades();

    } catch (err) {

      alert(

        err.response?.data?.message ||

        "Error al dar de baja"

      );

    }

  };


  // =====================================
  // HANDLE CANCEL
  // =====================================

  const handleCancel = () => {

    setShowForm(false);

    setEditingGrade(
      null
    );

    setForm({

      enrollmentId: "",

      partial1: "",
      partial2: "",
      partial3: ""

    });

  };


  return (

    <AppLayout>

      <div className="pg-wrap">

        {/* HEADER */}

        <div className="pg-head">

          <div>

            <h1 className="pg-title">
              Calificaciones
            </h1>

            <p className="pg-subtitle">
              Gestión de calificaciones escolares
            </p>

          </div>

          <button
            className="btn-primary"
            onClick={() =>
              setShowForm(true)
            }
          >

            + Nueva Calificación

          </button>

        </div>


        {/* FORM */}

        {
          showForm && (

            <div
              className="pg-card"
              style={{
                padding: "24px 28px"
              }}
            >

              <h5
                style={{
                  fontFamily:
                    "'Sora', sans-serif",

                  fontSize: 15,

                  fontWeight: 600,

                  marginBottom: 20
                }}
              >

                {
                  editingGrade

                  ? "Editar Calificación"

                  : "Nueva Calificación"
                }

              </h5>


              <form
                onSubmit={handleSubmit}
              >

                <div className="module-form-grid">

                  <div className="module-form-group">

                    <label className="modal-label">
                      Inscripción *
                    </label>

                    <select
                      className="pg-input"
                      name="enrollmentId"
                      value={form.enrollmentId}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Selecciona inscripción
                      </option>

                      {
                        enrollments.map(
                          enrollment => (

                            <option
                              key={enrollment.id}
                              value={enrollment.id}
                            >

                              {
                                enrollment.studentId
                              }

                              {" - "}

                              {
                                enrollment.subjectId
                              }

                            </option>

                          )
                        )
                      }

                    </select>

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Parcial 1 *
                    </label>

                    <input
                      type="number"
                      className="pg-input"
                      name="partial1"
                      value={form.partial1}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Parcial 2 *
                    </label>

                    <input
                      type="number"
                      className="pg-input"
                      name="partial2"
                      value={form.partial2}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Parcial 3 *
                    </label>

                    <input
                      type="number"
                      className="pg-input"
                      name="partial3"
                      value={form.partial3}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>


                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 20
                  }}
                >

                  <button
                    type="submit"
                    className="btn-primary"
                  >

                    {
                      editingGrade

                      ? "Guardar Cambios"

                      : "Crear Calificación"
                    }

                  </button>


                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={handleCancel}
                  >

                    Cancelar

                  </button>

                </div>

              </form>

            </div>

          )
        }


        {/* SEARCH */}

        <div className="pg-card module-toolbar">

          <div className="um-search-wrap">

            🔍

            <input
              className="um-search-input"
              placeholder="Buscar calificación..."
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
            />

          </div>


          {
            search && (

              <button
                className="btn-ghost"
                onClick={() =>
                  setSearch("")
                }
              >

                Limpiar

              </button>

            )
          }

        </div>


        {/* ERROR */}

        {
          error && (

            <div className="modal-error">

              {error}

            </div>

          )
        }


        {/* TABLE */}

        <div className="pg-card module-table-card">

          <table className="module-table">

            <thead>

              <tr>

                <th>Inscripción</th>

                <th>P1</th>

                <th>P2</th>

                <th>P3</th>

                <th>Promedio</th>

                <th>Status</th>

                <th>Acciones</th>

              </tr>

            </thead>


            <tbody>

              {
                loading

                ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="module-loading"
                    >

                      Cargando...

                    </td>

                  </tr>

                )

                : filtered.length === 0

                ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="module-empty"
                    >

                      No se encontraron calificaciones

                    </td>

                  </tr>

                )

                : (

                  filtered.map(
                    grade => {

                      const enrollment =
                        enrollments.find(

                          e => e.id ===
                          grade.enrollmentId

                        );

                      return (

                        <tr
                          key={grade.id}
                        >

                          <td>

                            {
                              enrollment

                              ? `${

                                  enrollment.studentId

                                } - ${

                                  enrollment.subjectId

                                }`

                              : "Sin inscripción"
                            }

                          </td>

                          <td>
                            {grade.partial1}
                          </td>

                          <td>
                            {grade.partial2}
                          </td>

                          <td>
                            {grade.partial3}
                          </td>

                          <td>

                            {
                              (
                                (
                                  Number(
                                    grade.partial1 || 0
                                  )

                                  +

                                  Number(
                                    grade.partial2 || 0
                                  )

                                  +

                                  Number(
                                    grade.partial3 || 0
                                  )

                                ) / 3
                              ).toFixed(1)
                            }

                          </td>

                          <td>

                            <span
                              className={
                                grade.status

                                ? "badge-active"

                                : "badge-inactive"
                              }
                            >

                              {
                                grade.status

                                ? "Activo"

                                : "Baja"
                              }

                            </span>

                          </td>

                          <td>

                            <div className="module-actions">

                              <button
                                className="module-btn-edit"
                                onClick={() =>
                                  handleEdit(
                                    grade
                                  )
                                }
                              >

                                Editar

                              </button>


                              <button
                                className="module-btn-delete"
                                onClick={() =>
                                  handleDelete(
                                    grade.id
                                  )
                                }
                              >

                                Baja

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )

                )
              }

            </tbody>

          </table>

        </div>


        {
          !loading &&
          filtered.length > 0 && (

            <p
              style={{

                fontSize: 12.5,

                color: "var(--text-2)",

                textAlign: "center"

              }}
            >

              Mostrando {filtered.length}
              de {grades.length}
              calificaciones

            </p>

          )
        }

      </div>

    </AppLayout>

  );

}