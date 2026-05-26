import axios from "axios";

const API_URL = "http://localhost:3000/api/grades"

export const getGrades = async() => {
    try {
        const response = await axios.get(API_URL)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const createGrades = async() => {
    try {
        const response = await axios.post(API_URL, gradeData)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const updateGrades = async(id, gradeData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, gradeData)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteGrade = async(id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}