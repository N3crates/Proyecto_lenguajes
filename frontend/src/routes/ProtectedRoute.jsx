// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// permission es opcional; si se omite solo verifica autenticación
const ProtectedRoute = ({ permission }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (permission) {
    const perms = user.permissions || [];
    if (user.role !== 'admin') {
      // Acepta string "permiso" o array ["permiso1", "permiso2"]
      const required = Array.isArray(permission) ? permission : [permission];
      const hasAny = required.some(p => perms.includes(p));
      if (!hasAny) return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;