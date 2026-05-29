const jwt = require('jsonwebtoken');

// Verifica rol fijo (lo que ya tenías, sin cambios)
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }
      if (!requiredRole.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Acceso Denegado: NO tiene los permisos necesarios' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error al verificar roles' });
    }
  };
};

// ── NUEVO: verifica permiso específico (para roles dinámicos) ────────────────
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const permissions = req.user.permissions || [];

      // Admin siempre pasa (por seguridad, aunque sus permisos ya lo cubren)
      if (req.user.role === 'admin') return next();

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ success: false, message: `Acceso denegado: se requiere permiso '${requiredPermission}'` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error al verificar permisos' });
    }
  };
};

module.exports = { checkRole, checkPermission };