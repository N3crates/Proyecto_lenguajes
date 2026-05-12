const express = require('express');
const cors = require('cors')
const app = express();
const studentRoutes = require("./modules/students/student.routes")

app.use(cors())
app.use(express.json());
app.use("/api/students", studentRoutes)

app.get("/",(req, res) => {
    res.json({
    message: 'API running correctly'
  });
});

module.exports = app;