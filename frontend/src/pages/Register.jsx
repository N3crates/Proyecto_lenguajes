import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // 1. NUEVO ESTADO PARA BLOQUEAR EL BOTÓN
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. EVITAR DOBLE ENVÍO
    if (loading) return;

    setLoading(true); // Bloqueamos la UI
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData
      );

      setSuccessMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: ""
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error al registrarse"
      );
      console.log(error);
    } finally {
      // 3. LIBERAMOS EL BOTÓN CUANDO TERMINE (ya sea éxito o error)
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-content">
          <h1>Crear Cuenta ᓚᘏᗢ</h1>
          <p className="auth-subtitle">Regístrate para comenzar en EduControl</p>

          <div className="auth-tabs">
            <Link to="/">
              <button>Iniciar Sesión</button>
            </Link>
            <button className="active">Registrarse</button>
          </div>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                placeholder="Ingresa tu nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
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
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Crea una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* 4. APLICAMOS EL BLOQUEO VISUAL */}
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? "Procesando..." : "Registrarse"}
            </button>
          </form>
          <p className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
          </p>
        </div>
      </div>
      <div className="auth-right">
        <div className="overlay">
          <h2>EduControl</h2>
          <p>Administra tu información académica de manera eficiente.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;