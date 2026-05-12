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

module.exports = {
  register,
  login
};