const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo: 15 minutos
  max: 10, // Máximo 10 intentos de login/registro por IP
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo en 15 minutos.'
  },
  standardHeaders: true, // Devuelve información del límite en los headers RateLimit-*
  legacyHeaders: false, // Desactiva los headers X-RateLimit-* antiguos
});

module.exports = { authLimiter };