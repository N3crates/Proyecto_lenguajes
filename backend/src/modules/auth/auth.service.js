const authRepository = require('./auth.repository');
const { validateRegister, validateLogin, validateChangePassword } = require('./auth.validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/firebase');

// Servicio de autenticación que maneja el registro, inicio de sesión,
// cambio de contraseña y renovación de tokens.

// Permisos por defecto para los 3 roles base (fallback si no están en Firestore)
const DEFAULT_PERMISSIONS = {
  admin: [
    'view_dashboard',
    'manage_users', 'manage_roles', 'view_audit',
    'manage_teachers', 'manage_students', 'manage_enrollments',
    'manage_subjects', 'manage_groups', 'manage_grades',
  ],
  teacher: [
    'view_dashboard',
    'view_own_groups',
    'manage_grades',
  ],
  student: [
    'view_dashboard',
    'view_own_grades',
    'view_enrollments',
  ],
};

// Helper: obtiene los permisos del rol desde Firestore
const getRolePermissions = async (roleName) => {
  const snap = await db.collection('roles')
    .where('name', '==', roleName)
    .limit(1)
    .get();
  
  console.log(`Buscando rol: ${roleName}, encontrado: ${!snap.empty}`);

  if (!snap.empty) {
    const perms = snap.docs[0].data().permissions;
    console.log('Permisos encontrados:', perms);
    if (Array.isArray(perms) && perms.length > 0) return perms;
  }

  // Fallback a permisos por defecto
  return DEFAULT_PERMISSIONS[roleName] || ['view_dashboard'];
};

const register = async (userData) => {
  // Validar los datos de entrada según las reglas definidas en auth.validation.
  const { error } = validateRegister(userData);
  if (error) throw new Error(error);

  // Verificar que no exista ya un usuario con el mismo correo.
  const existingUser = await authRepository.findByEmail(userData.email);
  if (existingUser) throw new Error('El usuario ya existe');

  // Encriptar la contraseña antes de guardarla en la base de datos.
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    status: 'active',
    createdAt: new Date()
  };

  // Guardar el nuevo usuario y devolver los datos sin la contraseña.
  const savedUser = await authRepository.saveUser(newUser);
  delete savedUser.password;
  return savedUser;
};

const login = async (userData) => {
  // Validar los datos de inicio de sesión.
  const { error } = validateLogin(userData);
  if (error) throw new Error(error);

  // Buscar el usuario por correo.
  const user = await authRepository.findByEmail(userData.email);
  if (!user) throw new Error('Credenciales inválidas');

  // Validar que el usuario no esté desactivado.
  if (user.status === 'inactive' || user.isActive === false) {
    throw new Error('Tu cuenta ha sido desactivada. Contacta al administrador.');
  }

  // Comparar la contraseña proporcionada con el hash almacenado.
  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) throw new Error('Credenciales inválidas');

  const permissions = await getRolePermissions(user.role);

  // Generar JWT de acceso y refresh token.
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, permissions },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, permissions },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, permissions }
  };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  // Validar los parámetros del cambio de contraseña.
  const { error } = validateChangePassword(currentPassword, newPassword);
  if (error) throw new Error(error);

  // Buscar usuario activo por su id.
  const user = await authRepository.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  // Verificar la contraseña actual antes de actualizar.
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('La contraseña actual es incorrecta');

  // Hashear la nueva contraseña y actualizar el registro.
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await authRepository.updatePassword(userId, hashedNewPassword);

  return { message: 'Contraseña actualizada correctamente' };
};

const refreshTokenService = async (oldRefreshToken) => {
  // Asegurarse de que se recibió un refresh token.
  if (!oldRefreshToken) throw new Error('Refresh token no proporcionado');

  // Verificar y decodificar el refresh token.
  const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await authRepository.findById(decoded.id);

  if (!user) throw new Error('El usuario ya no existe');
  if (user.status === 'inactive' || user.isActive === false) {
    throw new Error('Cuenta desactivada');
  }

  const permissions = await getRolePermissions(user.role);

  // Generar un nuevo token de acceso válido por 1 hora.
  const newAccessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { accessToken: newAccessToken };
};

module.exports = { register, login, changePassword, refreshTokenService };