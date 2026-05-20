import { useEffect, useState } from "react";
import "../styles/Auth.css";
import  {getStudents } from "../services/studentService";

const Students = () => {
    const [students, setStudents] = useState([])
    
    useEffect(() => {const fetchStudents = async () => {
        try {
            const response = await getStudents()
            console.log(response)
            setStudents(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchStudents()}, [])
    return (
    <div className="auth-container">
        <div className="auth-left">
            <div className="auth-content" style={{ maxWidth: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div>
                        <h1>Alumno</h1>
                        <p className="auth-subtitle">Gestión de alumnos</p>
                    </div>
                    <button className="auth-button">Nuevo Alumno</button>
                </div>
                {
                    students.length === 0 ? (
                        <div className="empty-message"> No hay alumnos registrados </div>
                    ): (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
                            {
                                students.map(student => (
                                    <div key={student.id} style={{ background: "white", borderRadius: "18px", padding: "25px", boxShadow:"0 10px 25px rgba(0,0,0,0,0.06"}}>
                                        <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>{student.name}</h3>
                                        <p style={{ color: "#64748b", marginBottom: "8px" }}>{student.email}</p>
                                        <p style={{ color: "#64748b", marginBottom: "8px" }}>{student.studentNumber}</p>
                                        <p style={{ color: "#64748b", marginBottom: "8px" }}>{student.career}</p>
                                        <p style={{ color: "#64748b", marginBottom: "8px" }}>Semestre:{" "}{student.semester}</p>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
        <div className="auth-right">
            <div className="overlay">
                <h2>EduControl</h2>
            </div>
        </div>
    </div>
    )
}


export default Students;