const db = require('../../config/firebase');

const getSummary = async (req, res) => {
  try {
    // 1. Ejecutamos los conteos físicos de las colecciones principales en paralelo
    const [
      usersSnapshot, 
      rolesSnapshot,
      teachersSnapshot,
      studentsSnapshot,
      groupsSnapshot,
      gradesSnapshot
    ] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('roles').count().get(),
      db.collection('teachers').count().get(), 
      db.collection('students').count().get(), 
      db.collection('groups').count().get(),   
      db.collection('grades').get()            //Traemos documentos para promediar
    ]);

    // 2. Calcular el promedio general de la escuela
    let generalAverage = 0;
    if (!gradesSnapshot.empty) {
      const totalGrades = gradesSnapshot.docs.length;
      // Supongamos que tu compañero guardará la nota en un campo llamado 'score' o 'grade'
      const sum = gradesSnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + (data.finalGrade || 0);
      }, 0);
      
      // Redondeamos a un decimal (ej. 8.5)
      generalAverage = Number((sum / totalGrades).toFixed(2)); 
    }

    // 3. Obtener los últimos 5 logs de actividad para el feed del Dashboard
    const recentActivitySnap = await db.collection('audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
      
    const recentActivity = recentActivitySnap.docs.map(doc => ({
      id: doc.id,
      action: doc.data().action,
      user: doc.data().user || 'Sistema',
      date: doc.data().timestamp.toDate()
    }));

    // 4. Respuesta estandarizada para tu diseño en React
    res.status(200).json({
      success: true,
      message: 'Resumen del dashboard escolar obtenido correctamente',
      data: {
        stats: {
          totalUsers: usersSnapshot.data().count,
          totalRoles: rolesSnapshot.data().count,
          totalTeachers: teachersSnapshot.data().count,
          totalStudents: studentsSnapshot.data().count,
          totalGroups: groupsSnapshot.data().count,
          generalAverage: generalAverage
        },
        recentActivity: recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al compilar las estadísticas del dashboard',
      error: error.message 
    });
  }
};

module.exports = { getSummary };