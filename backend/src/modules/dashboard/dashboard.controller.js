const db = require('../../config/firebase');

const getSummary = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    // ── ADMIN — stats globales ────────────────────────────────────────────
    if (role === 'admin') {
      const [usersSnap, rolesSnap, teachersSnap, studentsSnap, groupsSnap, gradesSnap, activitySnap] =
        await Promise.all([
          db.collection('users').count().get(),
          db.collection('roles').count().get(),
          db.collection('teachers').count().get(),
          db.collection('students').count().get(),
          db.collection('groups').count().get(),
          db.collection('grades').get(),
          db.collection('audit_logs').orderBy('timestamp', 'desc').limit(5).get(),
        ]);

      const generalAverage = gradesSnap.empty ? 0 :
        Number((gradesSnap.docs.reduce((acc, d) => acc + (d.data().finalGrade || 0), 0) / gradesSnap.docs.length).toFixed(2));

      const recentActivity = activitySnap.docs.map(doc => ({
        id:     doc.id,
        action: doc.data().action,
        user:   doc.data().user || 'Sistema',
        date:   doc.data().timestamp.toDate()
      }));

      return res.status(200).json({
        success: true,
        message: 'Resumen del dashboard escolar obtenido correctamente',
        data: {
          stats: {
            totalUsers:     usersSnap.data().count,
            totalRoles:     rolesSnap.data().count,
            totalTeachers:  teachersSnap.data().count,
            totalStudents:  studentsSnap.data().count,
            totalGroups:    groupsSnap.data().count,
            generalAverage,
          },
          recentActivity
        }
      });
    }

    // ── TEACHER — sus grupos, sus alumnos, promedio de sus alumnos ────────
    if (role === 'teacher') {
      const teacherSnap = await db.collection('teachers')
        .where('userId', '==', userId).limit(1).get();

      if (teacherSnap.empty) {
        return res.status(200).json({
          success: true,
          data: {
            stats: { totalGroups: 0, totalStudents: 0, generalAverage: 0 },
            recentActivity: []
          }
        });
      }

      const teacherId = teacherSnap.docs[0].id;

      // Grupos del docente
      const groupsSnap = await db.collection('groups')
        .where('teacherId', '==', teacherId).get();
      const groupIds = groupsSnap.docs.map(d => d.id);

      // Inscripciones en esos grupos
      let enrollments = [];
      if (groupIds.length > 0) {
        const chunks = [];
        for (let i = 0; i < groupIds.length; i += 30) chunks.push(groupIds.slice(i, i + 30));
        for (const chunk of chunks) {
          const snap = await db.collection('enrollments').where('groupId', 'in', chunk).get();
          enrollments.push(...snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      }

      // Alumnos únicos
      const uniqueStudents = new Set(enrollments.map(e => e.studentId)).size;
      const enrollmentIds  = enrollments.map(e => e.id);

      // Calificaciones de esos alumnos
      let grades = [];
      if (enrollmentIds.length > 0) {
        const chunks = [];
        for (let i = 0; i < enrollmentIds.length; i += 30) chunks.push(enrollmentIds.slice(i, i + 30));
        for (const chunk of chunks) {
          const snap = await db.collection('grades').where('enrollmentId', 'in', chunk).get();
          grades.push(...snap.docs.map(d => d.data()));
        }
      }

      const generalAverage = grades.length === 0 ? 0 :
        Number((grades.reduce((acc, g) => acc + (g.finalGrade || 0), 0) / grades.length).toFixed(2));

      // Actividad reciente del docente
      const activitySnap = await db.collection('audit_logs')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();

      const recentActivity = activitySnap.docs.map(doc => ({
        id:     doc.id,
        action: doc.data().action,
        user:   doc.data().user || 'Sistema',
        date:   doc.data().timestamp.toDate()
      }));

      return res.status(200).json({
        success: true,
        data: {
          stats: {
            totalGroups:   groupsSnap.docs.filter(d => d.data().status).length,
            totalStudents: uniqueStudents,
            generalAverage,
          },
          recentActivity
        }
      });
    }

    // ── STUDENT — su promedio, sus inscripciones ──────────────────────────
    if (role === 'student') {
      const studentSnap = await db.collection('students')
        .where('userId', '==', userId).limit(1).get();

      if (studentSnap.empty) {
        return res.status(200).json({
          success: true,
          data: {
            stats: { generalAverage: 0, totalEnrollments: 0, totalGroups: 0 },
            recentActivity: []
          }
        });
      }

      const studentId = studentSnap.docs[0].id;

      const [enrollmentsSnap, gradesSnap, activitySnap] = await Promise.all([
        db.collection('enrollments').where('studentId', '==', studentId).get(),
        db.collection('grades').get(),
        db.collection('audit_logs')
          .where('userId', '==', userId)
          .orderBy('timestamp', 'desc')
          .limit(5)
          .get(),
      ]);

      const enrollmentIds = enrollmentsSnap.docs.map(d => d.id);
      const myGrades = gradesSnap.docs
        .map(d => d.data())
        .filter(g => enrollmentIds.includes(g.enrollmentId));

      const generalAverage = myGrades.length === 0 ? 0 :
        Number((myGrades.reduce((acc, g) => acc + (g.finalGrade || 0), 0) / myGrades.length).toFixed(2));

      const recentActivity = activitySnap.docs.map(doc => ({
        id:     doc.id,
        action: doc.data().action,
        user:   doc.data().user || 'Sistema',
        date:   doc.data().timestamp.toDate()
      }));

      return res.status(200).json({
        success: true,
        data: {
          stats: {
            generalAverage,
            totalEnrollments: enrollmentsSnap.docs.filter(d => d.data().status).length,
            totalGroups:      enrollmentsSnap.docs.filter(d => d.data().status).length,
          },
          recentActivity
        }
      });
    }

    // ── Otros roles custom (coordinador, etc.) — stats básicas ───────────
    const activitySnap = await db.collection('audit_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    const recentActivity = activitySnap.docs.map(doc => ({
      id:     doc.id,
      action: doc.data().action,
      user:   doc.data().user || 'Sistema',
      date:   doc.data().timestamp.toDate()
    }));

    const [usersSnap, studentsSnap, groupsSnap, gradesSnap] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('students').count().get(),
      db.collection('groups').count().get(),
      db.collection('grades').get(),
    ]);

    const generalAverage = gradesSnap.empty ? 0 :
      Number((gradesSnap.docs.reduce((acc, d) => acc + (d.data().finalGrade || 0), 0) / gradesSnap.docs.length).toFixed(2));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers:    usersSnap.data().count,
          totalStudents: studentsSnap.data().count,
          totalGroups:   groupsSnap.data().count,
          generalAverage,
        },
        recentActivity
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al compilar las estadísticas del dashboard',
      error: error.message
    });
  }
};

module.exports = { getSummary };