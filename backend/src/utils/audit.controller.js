const db = require('../config/firebase');

const getAuditLogs = async (req, res) => {
  try {
    // Obtenemos los últimos 50 registros ordenados por fecha más reciente
    const snapshot = await db.collection('audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({ success: true, data: [] });
    }

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Firestore guarda las fechas como Timestamps, las pasamos a texto legible
      timestamp: doc.data().timestamp.toDate() 
    }));

    res.status(200).json({
      success: true,
      message: 'Logs de auditoría obtenidos',
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAuditLogs };