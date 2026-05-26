import { useState, useEffect, useMemo } from "react";
import AppLayout from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Enrollments() {

  const [enrollments, setEnrollments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingEnrollment,
    setEditingEnrollment] =
      useState(null);


  const [form, setForm] =
    useState({

      studentId: "",
      subjectId: "",
      groupId: "",
      enrollmentDate: ""

    });


  // =====================================
  // FETCH ENROLLMENTS
  // =====================================

  const fetchEnrollments =
  async () => {

    try {

      setLoading(true);

      const res =
        await api.get(
          "/enrollments"
        );

      setEnrollments(
        res.data.data
      );

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchEnrollments();

  }, []);


  // =====================================
  // FILTER
  // =====================================

  const filtered = useMemo(() => {

    const q =
      search.toLowerCase();

    return enrollments.filter(
      enrollment =>

        enrollment.studentId
          ?.toLowerCase()
          .includes(q)

        ||

        enrollment.subjectId
          ?.toLowerCase()
          .includes(q)

        ||

        enrollment.groupId
          ?.toLowerCase()
          .includes(q)

    );

  }, [enrollments, search]);


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

      if(editingEnrollment){

        await api.put(

          `/enrollments/${editingEnrollment.id}`,

          form

        );

      } else {

        await api.post(

          "/enrollments",

          form

        );

      }

      setShowForm(false);

      setEditingEnrollment(
        null
      );

      setForm({

        studentId: "",
        subjectId: "",
        groupId: "",
        enrollmentDate: ""

      });

      fetchEnrollments();

    } catch (err) {

      alert(

        err.response?.data?.message ||

        "Error al guardar inscripción"

      );

    }

  };


  // =====================================
  // HANDLE EDIT
  // =====================================

  const handleEdit =
  (enrollment) => {

    setEditingEnrollment(
      enrollment
    );

    setForm({

      studentId:
        enrollment.studentId || "",

      subjectId:
        enrollment.subjectId || "",

      groupId:
        enrollment.groupId || "",

      enrollmentDate:
        enrollment.enrollmentDate || ""

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
        "¿Dar de baja esta inscripción?"
      )
    ) return;

    try {

      await api.delete(
        `/enrollments/${id}`
      );

      fetchEnrollments();

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

    setEditingEnrollment(
      null
    );

    setForm({

      studentId: "",
      subjectId: "",
      groupId: "",
      enrollmentDate: ""

    });

  };


  return (

    <AppLayout>

      <div className="pg-wrap">

        {/* HEADER */}

        <div className="pg-head">

          <div>

            <h1 className="pg-title">
              Inscripciones
            </h1>

            <p className="pg-subtitle">
              Gestión de inscripciones escolares
            </p>

          </div>

          <button
            className="btn-primary"
            onClick={() =>
              setShowForm(true)
            }
          >

           + Nueva Inscripción

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
                  editingEnrollment

                  ? "Editar Inscripción"

                  : "Nueva Inscripción"
                }

              </h5>


              <form
                onSubmit={handleSubmit}
              >

                <div className="module-form-grid">

                  <div className="module-form-group">

                    <label className="modal-label">
                      ID Alumno *
                    </label>

                    <input
                      className="pg-input"
                      name="studentId"
                      value={form.studentId}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      ID Materia *
                    </label>

                    <input
                      className="pg-input"
                      name="subjectId"
                      value={form.subjectId}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      ID Grupo *
                    </label>

                    <input
                      className="pg-input"
                      name="groupId"
                      value={form.groupId}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Fecha *
                    </label>

                    <input
                      type="date"
                      className="pg-input"
                      name="enrollmentDate"
                      value={form.enrollmentDate}
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
                      editingEnrollment

                      ? "Guardar Cambios"

                      : "Crear Inscripción"
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

            <input
              className="um-search-input"
              placeholder="Buscar inscripción..."
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

                <th>Alumno</th>

                <th>Materia</th>

                <th>Grupo</th>

                <th>Fecha</th>

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
                      colSpan="6"
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
                      colSpan="6"
                      className="module-empty"
                    >

                      No se encontraron inscripciones

                    </td>

                  </tr>

                )

                : (

                  filtered.map(
                    enrollment => (

                      <tr
                        key={enrollment.id}
                      >

                        <td>
                          {enrollment.studentId}
                        </td>

                        <td>
                          {enrollment.subjectId}
                        </td>

                        <td>
                          {enrollment.groupId}
                        </td>

                        <td>
                          {enrollment.enrollmentDate}
                        </td>

                        <td>

                          <span
                            className={
                              enrollment.status

                              ? "badge-active"

                              : "badge-inactive"
                            }
                          >

                            {
                              enrollment.status

                              ? "Activa"

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
                                  enrollment
                                )
                              }
                            >

                              Editar

                            </button>


                            <button
                              className="module-btn-delete"
                              onClick={() =>
                                handleDelete(
                                  enrollment.id
                                )
                              }
                            >

                              Baja

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
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
              de {enrollments.length}
              inscripciones

            </p>

          )
        }

      </div>

    </AppLayout>

  );

}