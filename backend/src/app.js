const express = require('express');
const cors = require('cors')
const app = express();
const authRoutes = require('./modules/auth/auth.routes');

app.use(cors())
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente'
  });
});

app.use('/api/auth', authRoutes);

module.exports = app;