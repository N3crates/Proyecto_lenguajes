const Dashboard = () => {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/';

  };

  return (

    <div className="container mt-5">

      <div className="card shadow p-4">

        <h1>
          Bienvenido {user?.name || 'Usuario'}  👋
        </h1>

        <p>
          Login funcionando correctamente.
        </p>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>

      </div>

    </div>

  );
};

export default Dashboard;