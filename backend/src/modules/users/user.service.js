/**
 * user.service.js — actualizado
 * 
 * Cuando se crea un usuario con role = 'teacher',
 * automáticamente se crea también un documento en la colección 'teachers'
 * con datos básicos y el userId enlazado.
 * 
 * Esto conecta las dos colecciones sin romper nada existente:
 * - groups/subjects siguen referenciando teacherId (colección teachers)
 * - ese teacherId ahora tiene un userId que apunta a la cuenta de login
 */

const userRepository = require('./user.repository');
const { validateCreateUser, validateStatus } = require('./user.validation');
const bcrypt = require('bcrypt');
const { createAuditLog } = require('../../utils/audit.service');
const db = require('../../config/firebase'); // ← para crear el doc en teachers

const getAllUsers = async () => {
  const users = await userRepository.findAll();
  return users.map(user => { delete user.password; return user; });
};

const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');
  delete user.password;
  return user;
};

const createUser = async (userData, adminId) => {
  const { error } = validateCreateUser(userData);
  if (error) throw new Error(error);

  const exist = await userRepository.findByEmail(userData.email);
  if (exist) throw new Error('El correo ya está en uso');

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = {
    name:      userData.name,
    email:     userData.email,
    password:  hashedPassword,
    role:      userData.role || 'student',
    status:    'active',
    createdAt: new Date()
  };

  const savedUser = await userRepository.save(newUser);

  // ── Si el rol es 'teacher', crear perfil académico en la colección teachers ──
  if (userData.role === 'teacher') {
    // Separamos el nombre en partes (por si el nombre viene completo)
    const nameParts = (userData.name || '').trim().split(' ');
    const nombre    = nameParts[0]  || userData.name;
    const apaterno  = nameParts[1]  || '';
    const amaterno  = nameParts[2]  || '';

    const teacherDoc = {
      userId:    savedUser.id,     // ← enlace con la colección users
      nombre,
      apaterno,
      amaterno,
      email:     userData.email,
      ciudad:    '',
      status:    true,
      createdAt: new Date()
      // Los demás campos (especialidad, etc.) los completa el admin
      // desde la página de Teachers usando el botón "Editar"
    };

    await db.collection('teachers').add(teacherDoc);
  }

  await createAuditLog(adminId, 'CREATE_USER', {
    targetUserId: savedUser.id,
    email:        savedUser.email,
    role:         savedUser.role
  });

  delete savedUser.password;
  return savedUser;
};

const updateUser = async (id, updateData, adminId) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  } else { 
    delete updateData.password; 
  }

  delete updateData.email;

  // 1. Si el rol cambia A 'teacher' y no era teacher antes (Crear perfil)
  if (updateData.role === 'teacher' && user.role !== 'teacher') {
    const existing = await db.collection('teachers')
      .where('userId', '==', id)
      .limit(1)
      .get();

    if (existing.empty) {
      const nameParts = (user.name || '').trim().split(' ');
      await db.collection('teachers').add({
        userId:    id,
        nombre:    nameParts[0] || user.name,
        apaterno:  nameParts[1] || '',
        amaterno:  nameParts[2] || '',
        email:     user.email,
        ciudad:    '',
        status:    true,
        createdAt: new Date()
      });
    } else {
      // Si por alguna razón ya existía pero estaba inactivo, lo reactivamos
      await existing.docs[0].ref.update({ status: true });
    }
  }

  // 2. Si el rol cambia DE 'teacher' a otra cosa (Inactivar perfil)
  if (updateData.role && updateData.role !== 'teacher' && user.role === 'teacher') {
    const teacherSnap = await db.collection('teachers')
      .where('userId', '==', id)
      .limit(1)
      .get();
      
    if (!teacherSnap.empty) {
      // Inactivamos al docente para que no aparezca en listas activas, pero conservamos su ID para el historial
      await teacherSnap.docs[0].ref.update({ status: false });
    }
  }

  await userRepository.update(id, updateData);

  await createAuditLog(adminId, 'UPDATE_USER', { targetUserId: id, updates: updateData });

  return { message: 'Usuario actualizado correctamente' };
};

const changeUserStatus = async (id, status, adminId) => {
  const { error } = validateStatus(status);
  if (error) throw new Error(error);

  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  await userRepository.update(id, { status });

  // Sincronizar el status en el perfil de teacher si existe
  const teacherSnap = await db.collection('teachers')
    .where('userId', '==', id)
    .limit(1)
    .get();
  if (!teacherSnap.empty) {
    await teacherSnap.docs[0].ref.update({ status: status === 'active' });
  }

  await createAuditLog(adminId, 'CHANGE_USER_STATUS', { targetUserId: id, newStatus: status });

  return { message: `El estado del usuario ahora es: ${status}` };
};

const deleteUser = async (id, adminId) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  await userRepository.remove(id);

  // Si era teacher, desenlazar (no borrar para preservar histórico de grupos)
  const teacherSnap = await db.collection('teachers')
    .where('userId', '==', id)
    .limit(1)
    .get();
  if (!teacherSnap.empty) {
    await teacherSnap.docs[0].ref.update({ userId: null, status: false });
  }

  await createAuditLog(adminId, 'DELETE_USER', { targetUserId: id, email: user.email });

  return { message: 'Usuario eliminado permanentemente' };
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, changeUserStatus, deleteUser };