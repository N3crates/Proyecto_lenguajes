import axios from "axios"

const API_URL = "http://localhost:3000/api/students"

export const getStudents = async() => {
    const response = await axios.get("/students")
    return response.data
}

export const getStudentById = async(id) => {
    const response = await axios.get(`/students/${id}`)
    return response.data
}

export const createStudent = async(studentData) => {
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