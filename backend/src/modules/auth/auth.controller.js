const authService = require('./auth.service');
const db = require('../../config/firebase');


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
    // 1. Obtenemos el ID del usuario desde el token (inyectado por el middleware)
    const uid = req.user.id || req.user.uid;

    if (!uid) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    // 2. Buscamos el documento fresco en Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const userData = userDoc.data();

    // 3. Devolvemos la información completa (sin la contraseña)
    res.status(200).json({
      success: true,
      data: {
        uid: userDoc.id,
        name: userData.name || '',
        email: userData.email,
        role: userData.role || 'user',
        status: userData.status || 'active',
        createdAt: userData.createdAt
      }
    });
  } catch (error) {
    console.error('Error al obtener el perfil de Firestore:', error);
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

const refresh = async (req, res) => {
  try {
    // El frontend nos debe enviar el refreshToken en el body
    const { refreshToken } = req.body;
    
    const tokens = await authService.refreshTokenService(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refrescado correctamente',
      data: tokens
    });
  } catch (error) {
    // Si el refresh token caducó o es falso, mandamos 401 para que el frontend cierre la sesión
    res.status(401).json({
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
  changePassword,
  refresh
};