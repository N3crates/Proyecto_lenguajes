import { useEffect, useState } from "react";
import { getAllUsers, updateUser } from "../services/userService";

function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole });

      fetchUsers();

      alert("Rol actualizado exitosamente");
    } catch (err) {
      console.error("Error al actualizar rol", err);
      alert("Error al actualizar rol");
    }
  };

  return (
    <div className="dashboard-content">
      <h1>Gestión de Usuarios</h1>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </td>

                <td>
                  <button className="btn-delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users; 