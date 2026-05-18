import axios from "axios";

const API_URL =
  "http://localhost:3000/api/students";


// =====================================
// GET ALL STUDENTS
// =====================================

export const getStudents = async () => {

    try {

        const response =
            await axios.get(API_URL);

        return response.data;

    } catch (error) {

        console.log(error);

        throw error;

    }

};