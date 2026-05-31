import axios from "axios";

const API_URL = "http://localhost:3000/api/enrollments";

// Crea una instancia de axios que siempre adjunta el token del localStorage
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getEnrollments = async () => {
  const response = await api.get("/");
  return response.data;
};

export const createEnrollment = async (enrollmentData) => {
  const response = await api.post("/", enrollmentData);
  return response.data;
};

export const updateEnrollment = async (id, enrollmentData) => {
  const response = await api.put(`/${id}`, enrollmentData);
  return response.data;
};

export const deleteEnrollment = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};