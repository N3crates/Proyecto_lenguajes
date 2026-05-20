// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  // Si no hay usuario, lo mandamos al inicio (Login)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si sí hay usuario, lo dejamos pasar al componente hijo (Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;