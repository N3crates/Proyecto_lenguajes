const db = require('../config/firebase');

const createAuditLog = async (userId, action, details = {}) => {
  try {
    // Busca el nombre del usuario para mostrarlo en actividad reciente
    let userName = 'Sistema';
    if (userId && userId !== 'Sistema') {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) userName = userDoc.data().name || 'Sistema';
    }

    await db.collection('audit_logs').add({
      userId:    userId || 'Sistema',
      user:      userName,
      action:    action,
      details:   details,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error guardando log de auditoría:', error);
  }
};

module.exports = { createAuditLog };