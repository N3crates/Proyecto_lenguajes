const express = require('express');
const cors = require('cors')
const app = express();

//Ruta Modulos
const authRoutes = require('./modules/auth/auth.routes');
const studentRoutes = require("./modules/students/student.routes")
const enrollmentRoutes = require("./modules/enrollments/enrollment.routes")
const teacherRoutes = require("./modules/teachers/teacher.routes")
const subjectRoutes = require("./modules/subjects/subjects.routes")
const groupRoutes = require("./modules/groups/groups.routes")
const userRoutes = require('./modules/users/user.routes');
const roleRoutes = require('./modules/roles/role.routes');
const permissionRoutes = require('./modules/permissions/permission.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

//Ruta middleware
const { authLimiter } = require('./middlewares/rateLimit.middleware');
//Ruta utils
const auditRoutes = require('./utils/audit.routes');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/students", studentRoutes)
app.use("/api/enrollments", enrollmentRoutes)
app.use("/api/teachers", teacherRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/groups", groupRoutes)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente'
  });
});


module.exports = app;