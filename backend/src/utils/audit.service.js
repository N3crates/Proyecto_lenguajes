const db = require('../config/firebase');

// Función para crear un log de auditoría
const createAuditLog = async (userId, action, details = {}) => {
  try {
    const auditRef = db.collection('audit_logs');
    
    const newLog = {
      userId: userId || 'Sistema', // Quién hizo la acción
      action: action,              // Ej: 'CREATE_ROLE', 'UPDATE_USER'
      details: details,            // Qué cambió (datos extra)
      timestamp: new Date()        // Cuándo lo hizo
    };

    await auditRef.add(newLog);

  } catch (error) {
    console.error('Error guardando log de auditoría:', error);
  }
};

module.exports = { createAuditLog };