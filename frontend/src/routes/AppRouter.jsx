// AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import ProtectedRoute from './ProtectedRoute'; 
import Users from '../pages/Users';
import Teachers from '../pages/Teachers';
import Subjects from '../pages/Subjects';
import Groups from '../pages/Groups';
import Enrollments from '../pages/Enrollments';
<<<<<<< Updated upstream
import Profile from '../pages/Profile';
import Roles from '../pages/Roles';
import Audit from '../pages/Audit';
=======
import Grades from '../pages/Grades';
>>>>>>> Stashed changes

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas Privadas (Protegidas) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/enrollments" element={<Enrollments />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/audit" element={<Audit />} />
      </Route>

      {/* Si escriben una ruta que no existe, los mandamos al login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;