import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Actualizar usuario (incluyendo cambio de rol)
export const updateUser = async (id, userData) => {
  const token = localStorage.getItem("token");
  return await axios.put(`${API_URL}/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};