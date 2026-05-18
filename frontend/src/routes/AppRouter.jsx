import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';

const AppRouter = () => {
  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route 
        path='/students'
        element={<Students/>}
      />

      <Route
        path="*"
        element={<Navigate to="/login" />}
      />

    </Routes>

  );
};

export default AppRouter;