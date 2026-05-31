const roleService = require('./role.service');

const getRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createRole = async (req, res) => {
  try {
    const newRole = await roleService.createRole(req.body);
    res.status(201).json({
      success: true,
      message: 'Rol Creado',
      data: newRole
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updateRole = await roleService.updateRole(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Rol Actualizado',
      data: updateRole
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await roleService.deleteRole(id);
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
  getRoles,
  createRole,
  updateRole,
  deleteRole
};