import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

      await axios.post(
        "http://localhost:3000/api/auth/register",
        formData
      );

      alert("Usuario registrado correctamente");

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error al registrarse"
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
            Crear Cuenta ᓚᘏᗢ
          </h1>

          <p className="auth-subtitle">
            Regístrate para comenzar en EduControl
          </p>

          {/* TABS */}
          <div className="auth-tabs">

            <Link to="/">
              <button>
                Iniciar Sesión
              </button>
            </Link>

            <button className="active">
              Registrarse
            </button>

          </div>

          {/* FORMULARIO */}
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>
                Nombre
              </label>

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
                placeholder="Crea una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="submit"
              className="auth-button"
            >
              Registrarse
            </button>

          </form>

          <p className="auth-footer">

            ¿Ya tienes cuenta?

            <Link to="/">
              Iniciar sesión
            </Link>

          </p>

        </div>

      </div>

      {/* PANEL DERECHO */}
      <div className="auth-right">

        <div className="overlay">

          <h2>EduControl</h2>

          <p>
            Administra tu información académica
            de manera eficiente.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;