const userService = require('./user.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createUser = async (req, res) => {
  try {
    const adminId = req.user.id; // Extraído por el authMiddleware
    const newUser = await userService.createUser(req.body, adminId);
    res.status(201).json({ success: true, 
      message: 'Usuario creado', 
      data: newUser 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const result = await userService.updateUser(req.params.id, req.body, adminId);
    res.status(200).json({ 
      success: true, 
      message: result.message 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { status } = req.body; // Se espera "active" o "inactive"
    
    if (!status) throw new Error('Se requiere el nuevo status');

    const result = await userService.changeUserStatus(req.params.id, status, adminId);
    res.status(200).json({ 
      success: true, 
      message: result.message 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const adminId = req.user.id;
    const result = await userService.deleteUser(req.params.id, adminId);
    res.status(200).json({ 
      success: true, 
      message: result.message 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  changeUserStatus, 
  deleteUser
};