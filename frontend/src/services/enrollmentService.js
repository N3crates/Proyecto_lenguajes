import axios from "axios"

const API_URL = "http://localhost:3000/api/enrollments"

export const getEnrollments = async() => {
    try {
        const response = await axios.get(API_URL)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const createEnrollment = async(enrollmentData) => {
    try {
        const response = await axios.post(API_URL, enrollmentData)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateEnrollment = async(id, enrollmentData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, enrollmentData)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const deleteEnrollment = async(id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}