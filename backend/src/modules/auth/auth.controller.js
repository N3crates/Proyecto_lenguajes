const authService = require('./auth.service');


const register = async(req, res) => {
  try {
    const userData = req.body;
    const newUser = await authService.register(userData);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente (～￣▽￣)～',
      data: newUser
    });
  }catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async(req, res) => {
  try{
    const userData = req.body;
    const user = await authService.login(userData);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    // Los datos ya vienen del middleware en req.user
    res.status(200).json({
      success: true,
      data: req.user 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil'
    });
  }
};

const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente.'
  });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Obtenido del middleware

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Ambas contraseñas son requeridas'
      });
    }

    await authService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Contraseña cambiada con éxito!!'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  changePassword
};