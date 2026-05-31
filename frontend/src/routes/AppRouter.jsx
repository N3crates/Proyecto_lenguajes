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
import MyGroups from '../pages/MyGroups';
import Enrollments from '../pages/Enrollments';

import Profile from '../pages/Profile';
import Roles from '../pages/Roles';
import Audit from '../pages/Audit';
import Grades from '../pages/Grades';


const AppRouter = () => {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Solo autenticación */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile"   element={<Profile />} />
      </Route>

      {/* Administración */}
      <Route element={<ProtectedRoute permission="manage_users" />}>
        <Route path="/users" element={<Users />} />
      </Route>
      <Route element={<ProtectedRoute permission="manage_roles" />}>
        <Route path="/roles" element={<Roles />} />
      </Route>
      <Route element={<ProtectedRoute permission="view_audit" />}>
        <Route path="/audit" element={<Audit />} />
      </Route>

      {/* Escolar */}
      <Route element={<ProtectedRoute permission="manage_teachers" />}>
        <Route path="/teachers" element={<Teachers />} />
      </Route>
      <Route element={<ProtectedRoute permission="manage_students" />}>
        <Route path="/students" element={<Students />} />
      </Route>

      {/* Inscripciones: admin con manage_enrollments 
      Si se hace una pagina de MyEnrrollments.jsx solo cambiar view_enrollments
      a una ruta protegida propia con path /my-enrollments */}
      <Route element={<ProtectedRoute permission={["manage_enrollments", "view_enrollments"]} />}>
        <Route path="/enrollments" element={<Enrollments />} />
      </Route>

      {/* Académico */}
      <Route element={<ProtectedRoute permission="manage_subjects" />}>
        <Route path="/subjects" element={<Subjects />} />
      </Route>
      <Route element={<ProtectedRoute permission="manage_groups" />}>
        <Route path="/groups" element={<Groups />} />
      </Route>
      <Route element={<ProtectedRoute permission={["manage_grades", "view_grades"]} />}>
        <Route path="/grades" element={<Grades />} />
      </Route>

      {/* Teacher */}
      <Route element={<ProtectedRoute permission="view_own_groups" />}>
        <Route path="/groups/my-groups" element={<MyGroups />} />
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute permission="view_own_grades" />}>
        <Route path="/my-grades" element={<Grades />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};


export default AppRouter;