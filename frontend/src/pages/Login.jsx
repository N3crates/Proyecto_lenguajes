import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", formData);

    // Accedemos a response.data.data porque tu controlador envía un objeto con la llave "data"
    const loginData = response.data.data; 

    const token = loginData.accessToken;

    const payload = JSON.parse(
      atob(token.split('.')[1])
    );

    console.log("JWT Payload:", payload);

    console.log(
      "Permisos en JWT:",
      payload.permissions
    );

    login(loginData.user, loginData.accessToken);

    navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al iniciar sesión"
      );

      console.log(error);
    }
  };

  return (
    <div className="auth-container">

      {/* PANEL IZQUIERDO */}
      <div className="auth-left">

        <div className="auth-content">
          <h1>
            Bienvenido <span>🐙</span>
          </h1>

          <p className="auth-subtitle">
            Inicia sesión para continuar en EduControl
          </p>

          {/* TABS */}
          <div className="auth-tabs d-flex justify-content-center align-items-center" >

            <button className="active">
              Iniciar Sesión ᓚᘏᗢ
            </button>

          </div>

          {/* FORMULARIO */}
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Correo electrónico
              </label>

              <input
                type="email"
                name="email"
                placeholder="Ingresa tu correo"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Contraseña
              </label>

              <input
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="submit"
              className="auth-button"
            >
              Iniciar Sesión
            </button>

          </form>

          <p className="auth-footer">
            ¿No tienes cuenta?

            <Link to="/login" className="auth-link">
              Que mal ╯︿╰ 
            </Link>
          </p>

        </div>

      </div>

      {/* PANEL DERECHO */}
      <div className="auth-right">

        <div className="overlay">

          <h2>EduControl</h2>

          <p>
            Gestiona estudiantes, materias y grupos
            de forma simple y moderna.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;