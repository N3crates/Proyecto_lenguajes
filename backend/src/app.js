const express = require('express');
const cors = require('cors')
const app = express();
const authRoutes = require('./modules/auth/auth.routes');
const studentRoutes = require("./modules/students/student.routes")
const enrollmentRoutes = require("./modules/enrollments/enrollment.routes")
const gradeRoutes = require("./modules/grades/grade.routes")

app.use(cors())
app.use(express.json());
app.use("/api/students", studentRoutes)
app.use("/api/enrollments", enrollmentRoutes)
app.use("/api/grades", gradeRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente'
  });
});

app.use('/api/auth', authRoutes);

module.exports = app;