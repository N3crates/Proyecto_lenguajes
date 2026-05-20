import { useEffect, useState } from "react";



import {
  getStudents
} from "../services/studentService";

import "./Auth.css";


function Students() {

  const [students, setStudents] =
    useState([]);


  useEffect(() => {

    const fetchStudents = async () => {

      try {

        const response =
          await getStudents();

        setStudents(response.data);

      } catch (error) {

        console.log(error);

      }

    };

    fetchStudents();

  }, []);


  return (

    <div
      className="auth-container"
      style={{
        background: "#f1f5f9"
      }}
    >

      {/* LEFT PANEL */}

      <div
        className="auth-left"
        style={{
          width: "70%",
          alignItems: "flex-start",
          paddingTop: "50px",
          background: "#f1f5f9"
        }}
      >

        <div
          className="auth-content"
          style={{
            maxWidth: "100%"
          }}
        >

          {/* HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px"
            }}
          >

            <div>

              <h1>
                Gestión de Alumnos 🎓
              </h1>

              <p className="auth-subtitle">
                Administra y visualiza los alumnos registrados
              </p>

            </div>

            <button
              className="auth-button"
              style={{
                width: "220px"
              }}
            >

              + Nuevo Alumno

            </button>

          </div>


          {/* STATS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
              marginBottom: "35px"
            }}
          >

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "18px",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.05)"
              }}
            >

              <h3
                style={{
                  color: "#2563eb",
                  fontSize: "38px"
                }}
              >
                {students.length}
              </h3>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "8px"
                }}
              >
                Alumnos activos
              </p>

            </div>

          </div>


          {/* STUDENTS */}

          {
            students.length === 0
            ? (

              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "18px",
                  textAlign: "center",
                  color: "#64748b",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.05)"
                }}
              >

                No hay alumnos registrados

              </div>

            )
            : (

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(320px,1fr))",
                  gap: "25px"
                }}
              >

                {
                  students.map(student => (

                    <div
                      key={student.id}
                      style={{
                        background: "white",
                        borderRadius: "22px",
                        padding: "28px",
                        boxShadow:
                          "0 10px 25px rgba(0,0,0,0.06)",
                        transition: "0.3s"
                      }}
                    >

                      {/* TOP */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginBottom: "20px"
                        }}
                      >

                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "22px",
                            fontWeight: "bold"
                          }}
                        >

                          {
                            student.name
                              ?.charAt(0)
                              ?.toUpperCase()
                          }

                        </div>

                        <div>

                          <h3
                            style={{
                              color: "#1e293b",
                              marginBottom: "5px"
                            }}
                          >
                            {student.name}
                          </h3>

                          <p
                            style={{
                              color: "#64748b",
                              fontSize: "14px"
                            }}
                          >
                            {student.career}
                          </p>

                        </div>

                      </div>


                      {/* INFO */}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          marginBottom: "25px"
                        }}
                      >

                        <p
                          style={{
                            color: "#475569"
                          }}
                        >
                          📧 {student.email}
                        </p>

                        <p
                          style={{
                            color: "#475569"
                          }}
                        >
                          🎓 {student.studentNumber}
                        </p>

                        <p
                          style={{
                            color: "#475569"
                          }}
                        >
                          📚 Semestre {student.semester}
                        </p>

                      </div>


                      {/* BUTTONS */}

                      <div
                        style={{
                          display: "flex",
                          gap: "12px"
                        }}
                      >

                        <button
                          className="auth-button"
                          style={{
                            flex: 1,
                            padding: "12px",
                            fontSize: "14px"
                          }}
                        >

                          Editar

                        </button>

                        <button
                          style={{
                            flex: 1,
                            border: "none",
                            borderRadius: "10px",
                            background: "#ef4444",
                            color: "white",
                            fontWeight: "bold",
                            cursor: "pointer"
                          }}
                        >

                          Eliminar

                        </button>

                      </div>

                    </div>

                  ))
                }

              </div>

            )
          }

        </div>

      </div>

    </div>

  );

}


export default Students;