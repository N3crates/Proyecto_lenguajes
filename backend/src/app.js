const express = require('express');
const cors = require('cors')
const app = express();
const authRoutes = require('./modules/auth/auth.routes');
const studentRoutes = require("./modules/students/student.routes")
const enrollmentRoutes = require("./modules/enrollments/enrollment.routes")
const teacherRoutes = require("./modules/teachers/teachers.routes")
const subjectRoutes = require("./modules/subjects/subjects.routes")
const groupRoutes = require("./modules/groups/groups.routes")

app.use(cors())
app.use(express.json());
app.use("/api/students", studentRoutes)
app.use("/api/enrollments", enrollmentRoutes)
app.use("/api/teachers", teacherRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/groups", groupRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente'
  });
});

app.use('/api/auth', authRoutes);

module.exports = app;