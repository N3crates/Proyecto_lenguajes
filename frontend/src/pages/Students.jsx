import { useEffect, useState } from "react";
import  {getStudents } from "../services/studentService";

const Students = () => {
    const [students, setStudents] = useState([])
    
    useEffect(() => {

    const fetchStudents = async () => {

        try {

            const response =
                await getStudents();

            console.log(response);

            setStudents(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    fetchStudents();

}, []);
    return (
    <div>
            <h1>
                Lista de Alumnos
            </h1>
            { students.length === 0 ? (<p> No hay alumnos</p>)
                :(students.map(student => (
                        <div key={student.id} style={{ border: "1px solid gray", padding: "10px", marginBottom: "10px"}}>
                            <h3>{student.name}</h3>
                            <p>Email:{" "}{student.email}</p>
                            <p>Matrícula:{" "}{student.studentNumber}</p>
                            <p>Carrera:{" "}{student.career}</p>
                            <p>Semestre:{" "}{student.semester}</p>
                        </div>
                    ))
                )
            }
        </div>
    );
};


export default Students;