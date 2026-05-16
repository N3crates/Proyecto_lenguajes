const jwt = require('jsonwebtoken')

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      //Verificar que el usuario exista en la request - Que haya pasado por el auth.middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
      //Verificar si el rol del usuario esta incluido en los roles permitidos
      if (!requiredRole.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Acceso Denegado: NO tiene los permisos necesarios'
        });
      }

      //Si todo jala continua 
      next();
    }catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar roles'
      });
    }
  };
};

module.exports = checkRole;