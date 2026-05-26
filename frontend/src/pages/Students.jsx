import { useState, useEffect, useMemo } from "react";
import AppLayout from "../components/layout/Applayout";
import api from "../api/axios";
import "../styles/Teachers.css";

export default function Students() {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingStudent,
    setEditingStudent] =
      useState(null);


  const [form, setForm] =
    useState({

      name: "",
      email: "",
      studentNumber: "",
      career: "",
      semester: ""

    });


  // =====================================
  // FETCH STUDENTS
  // =====================================

  const fetchStudents =
  async () => {

    try {

      setLoading(true);

      const res =
        await api.get(
          "/students"
        );

      setStudents(
        res.data.data
      );

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchStudents();

  }, []);


  // =====================================
  // FILTER
  // =====================================

  const filtered = useMemo(() => {

    const q =
      search.toLowerCase();

    return students.filter(
      student =>

        student.name
          ?.toLowerCase()
          .includes(q)

        ||

        student.email
          ?.toLowerCase()
          .includes(q)

        ||

        student.career
          ?.toLowerCase()
          .includes(q)

        ||

        student.studentNumber
          ?.toLowerCase()
          .includes(q)

    );

  }, [students, search]);


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

      if(editingStudent){

        await api.put(

          `/students/${editingStudent.id}`,

          form

        );

      } else {

        await api.post(

          "/students",

          form

        );

      }

      setShowForm(false);

      setEditingStudent(
        null
      );

      setForm({

        name: "",
        email: "",
        studentNumber: "",
        career: "",
        semester: ""

      });

      fetchStudents();

    } catch (err) {

      alert(

        err.response?.data?.message ||

        "Error al guardar alumno"

      );

    }

  };


  // =====================================
  // HANDLE EDIT
  // =====================================

  const handleEdit =
  (student) => {

    setEditingStudent(
      student
    );

    setForm({

      name:
        student.name || "",

      email:
        student.email || "",

      studentNumber:
        student.studentNumber || "",

      career:
        student.career || "",

      semester:
        student.semester || ""

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
        "¿Dar de baja este alumno?"
      )
    ) return;

    try {

      await api.delete(
        `/students/${id}`
      );

      fetchStudents();

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

    setEditingStudent(
      null
    );

    setForm({

      name: "",
      email: "",
      studentNumber: "",
      career: "",
      semester: ""

    });

  };


  return (

    <AppLayout>

      <div className="pg-wrap">

        {/* HEADER */}

        <div className="pg-head">

          <div>

            <h1 className="pg-title">
              Alumnos
            </h1>

            <p className="pg-subtitle">
              Gestión de alumnos escolares
            </p>

          </div>

          <button
            className="btn-primary"
            onClick={() =>
              setShowForm(true)
            }
          >

            + Nuevo Alumno

          </button>

        </div>
{/* STATS CARDS */}

<div className="db-widgets">

  {/* TOTAL */}

  <div className="db-widget g-indigo">

    <div className="db-widget-top">

      <span className="db-widget-icon">
        👨‍🎓
      </span>

    </div>

    <p className="db-widget-value">
      {students.length}
    </p>

    <p className="db-widget-label">
      Total Alumnos
    </p>

    <p className="db-widget-sub">
      Registrados en el sistema
    </p>

  </div>


  {/* ACTIVOS */}

  <div className="db-widget g-teal">

    <div className="db-widget-top">

      <span className="db-widget-icon">
        ✅
      </span>

    </div>

    <p className="db-widget-value">

      {
        students.filter(
          s => s.status
        ).length
      }

    </p>

    <p className="db-widget-label">
      Alumnos Activos
    </p>

    <p className="db-widget-sub">
      Actualmente activos
    </p>

  </div>


  {/* BAJA */}

  <div className="db-widget g-rose">

    <div className="db-widget-top">

      <span className="db-widget-icon">
        ❌
      </span>

    </div>

    <p className="db-widget-value">

      {
        students.filter(
          s => !s.status
        ).length
      }

    </p>

    <p className="db-widget-label">
      Alumnos de Baja
    </p>

    <p className="db-widget-sub">
      Inactivos en el sistema
    </p>

  </div>

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
                  editingStudent

                  ? "Editar Alumno"

                  : "Nuevo Alumno"
                }

              </h5>


              <form
                onSubmit={handleSubmit}
              >

                <div className="module-form-grid">

                  <div className="module-form-group">

                    <label className="modal-label">
                      Nombre *
                    </label>

                    <input
                      className="pg-input"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Email *
                    </label>

                    <input
                      type="email"
                      className="pg-input"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Matrícula *
                    </label>

                    <input
                      className="pg-input"
                      name="studentNumber"
                      value={form.studentNumber}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Carrera *
                    </label>

                    <input
                      className="pg-input"
                      name="career"
                      value={form.career}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  <div className="module-form-group">

                    <label className="modal-label">
                      Semestre *
                    </label>

                    <input
                      type="number"
                      className="pg-input"
                      name="semester"
                      value={form.semester}
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
                      editingStudent

                      ? "Guardar Cambios"

                      : "Crear Alumno"
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
              placeholder="Buscar alumno..."
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

                <th>Nombre</th>

                <th>Email</th>

                <th>Matrícula</th>

                <th>Carrera</th>

                <th>Semestre</th>

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

                      No se encontraron alumnos

                    </td>

                  </tr>

                )

                : (

                  filtered.map(
                    student => (

                      <tr
                        key={student.id}
                      >

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.email}
                        </td>

                        <td>
                          {student.studentNumber}
                        </td>

                        <td>
                          {student.career}
                        </td>

                        <td>
                          {student.semester}
                        </td>

                        <td>

                          <span
                            className={
                              student.status

                              ? "badge-active"

                              : "badge-inactive"
                            }
                          >

                            {
                              student.status

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
                                  student
                                )
                              }
                            >

                              Editar

                            </button>


                            <button
                              className="module-btn-delete"
                              onClick={() =>
                                handleDelete(
                                  student.id
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
              de {students.length}
              alumnos

            </p>

          )
        }

      </div>

    </AppLayout>

  );

}