const db = require('../../config/firebase');

const getSummary = async (req, res) => {
  try {
    // Usamos Promiese.all para hacer todas las consultas al mismo tiempo y que sea rapidísimo
    const [
      usersSnapshot, 
      rolesSnapshot,
      teachersSnapshot,
      studentsSnapshot
    ] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('roles').count().get(),
      db.collection('teachers').count().get(), // Colección del Integrante 2
      db.collection('students').count().get()  // Colección del Integrante 3
    ]);

    // Obtenemos un par de logs recientes para mostrar actividad reciente en el dashboard
    const recentActivitySnap = await db.collection('audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
      
    const recentActivity = recentActivitySnap.docs.map(doc => ({
      action: doc.data().action,
      date: doc.data().timestamp.toDate()
    }));

    res.status(200).json({
      success: true,
      message: 'Resumen de dashboard obtenido',
      data: {
        stats: {
          totalUsers: usersSnapshot.data().count,
          totalRoles: rolesSnapshot.data().count,
          totalTeachers: teachersSnapshot.data().count,
          totalStudents: studentsSnapshot.data().count
        },
        recentActivity: recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSummary };