const userRepository = require('./user.repository');
const { validateCreateUser, validateStatus } = require('./user.validation');
const bcrypt = require('bcrypt');
const { createAuditLog } = require('../../utils/audit.service');

const getAllUsers = async () => {
  const users = await userRepository.findAll();
  return users.map(user => {
    delete user.password; // Ocultamos contraseñas por seguridad
    return user;
  });
};

// Obtener un usuario por ID
const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');
  delete user.password;
  return user;
};

// Crear un nuevo usuario (Solo para admins)
const createUser = async (userData, adminId) => {
  const { error } = validateCreateUser(userData);
  if (error) throw new Error(error);

  // Verificar si el correo ya está registrado
  const exist = await userRepository.findByEmail(userData.email);
  if (exist) throw new Error('El correo ya está en uso');

  // Hash de la contraseña antes de guardar
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Construir el nuevo usuario
  const newUser = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'user',
    status: 'active',
    createdAt: new Date()
  };

  // Guardar el nuevo usuario en la base de datos
  const savedUser = await userRepository.save(newUser);

  // Registrar la acción en el log de auditoría
  await createAuditLog(adminId, 'CREATE_USER', { targetUserId: savedUser.id, email: savedUser.email });

  delete savedUser.password;
  return savedUser;
};

// Actualizar un usuario existente (Solo para admins)
const updateUser = async (id, updateData, adminId) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  // Si se intenta actualizar el correo, verificar que no esté en uso por otro usuario
  if (updateData.email && updateData.email !== user.email) {
    const emailExist = await userRepository.findByEmail(updateData.email);
    if (emailExist) throw new Error('El correo ya está en uso por otro usuario');
  }

  // Si se proporciona una nueva contraseña, hashearla antes de actualizar
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  } else {
    delete updateData.password;
  }

  delete updateData.email; // Protegemos el email de cambios

  // Actualizar el usuario en la base de datos
  await userRepository.update(id, updateData);

  // Registrar la acción en el log de auditoría
  await createAuditLog(adminId, 'UPDATE_USER', { targetUserId: id, updates: updateData });

  return { message: 'Usuario actualizado correctamente' };
};

// Cambiar el estado de un usuario (activar/desactivar) - Solo para admins
const changeUserStatus = async (id, status, adminId) => {
  const { error } = validateStatus(status);
  if (error) throw new Error(error);

  // Verificar que el usuario exista
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  // Actualizar el estado del usuario
  await userRepository.update(id, { status });

  // Registrar la acción en el log de auditoría
  await createAuditLog(adminId, 'CHANGE_USER_STATUS', { targetUserId: id, newStatus: status });
  
  return { message: `El estado del usuario ahora es: ${status}` };
};

// Eliminar un usuario permanentemente (Solo para admins)
const deleteUser = async (id, adminId) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  // Eliminar el usuario de la base de datos
  await userRepository.remove(id);

  // Registrar la acción en el log de auditoría
  await createAuditLog(adminId, 'DELETE_USER', { targetUserId: id, email: user.email });

  return { message: 'Usuario eliminado permanentemente' };
};

module.exports = {
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  changeUserStatus, 
  deleteUser
};