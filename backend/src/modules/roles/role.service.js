const roleRepository = require('./role.repository');
const  validateRoleInput  = require('./role.validation');
const { createAuditLog } = require('../../utils/audit.service');

// Obtener todos los roles
const getAllRoles = async () => {
  return await roleRepository.findAll();
};

// Crear un nuevo rol (Solo para admins)
const createRole = async (roleData, adminId) => {
  const { error } = validateRoleInput(roleData);
  if (error) throw new Error(error);

  // Verificar si el rol ya existe
  const exist = await roleRepository.findByName(roleData.name);
  if (exist) throw new Error('El rol ya existe');

  // Construir el nuevo rol con los datos proporcionados
  const newRole = {
    name: roleData.name,
    permissions: roleData.permissions || [],
    description: roleData.description || '',
    createdAt: new Date()
  };

  // Guardar el nuevo rol en la base de datos
  const savedRole = await roleRepository.save(newRole);

  // Registrar la acción en el log de auditoría
  await createAuditLog(adminId, 'CREATE_ROLE', { roleName: savedRole.name, roleId: savedRole.id });

  return savedRole;
};

// Actualizar un rol existente (Solo para admins)
const updateRole = async (id, roleData, adminId) => {
  const exist = await roleRepository.findById(id);
  if (!exist) throw new Error('Rol no encontrado');

  // Actualizar el rol en la base de datos
  await roleRepository.update(id, roleData); 

  // Registrar la acción en el log de auditoría
  await createAuditLog(adminId, 'UPDATE_ROLE', { roleId: id, updates: roleData });

  return { id, ...roleData };
};

// Eliminar un rol (Solo para admins)
const deleteRole = async (id, adminId) => {
  const exist = await roleRepository.findById(id);
  if (!exist) throw new Error('Rol no encontrado');

  // Eliminar el rol de la base de datos
  await roleRepository.remove(id);

  // Registrar la acción en el log de auditoría
  await createAuditLog(adminId, 'DELETE_ROLE', { roleId: id, roleName: exist.name });

  return { message: 'Rol eliminado correctamente' };
};

module.exports = { 
  getAllRoles, 
  createRole, 
  updateRole, 
  deleteRole 
};