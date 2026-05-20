import axios from "axios";

const API_URL = "http://localhost:3000/api/students";

export const getStudents = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createStudent = async (studentData) => {
    try {
        const response = await axios.post(API_URL, studentData)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateStudent = async(id, studentData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, studentData)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const deleteStudent = async(id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}
