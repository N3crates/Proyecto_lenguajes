const userRepository = require('./user.repository');
const { validateCreateUser, validateStatus } = require('./user.validation');
const bcrypt = require('bcrypt');
const { createAuditLog } = require('../../utils/audit.service');
const db = require('../../config/firebase');

// ─── Helpers de perfil ────────────────────────────────────────────────────────
const splitName = (fullName = '') => {
  const parts = fullName.trim().split(' ');
  return { nombre: parts[0] || fullName, apaterno: parts[1] || '', amaterno: parts[2] || '' };
};

const createTeacherProfile = async (userId, name, email) => {
  const existing = await db.collection('teachers').where('userId', '==', userId).limit(1).get();
  if (!existing.empty) {
    await existing.docs[0].ref.update({ status: true });
    return;
  }
  const { nombre, apaterno, amaterno } = splitName(name);
  await db.collection('teachers').add({ userId, nombre, apaterno, amaterno, email, ciudad: '', status: true, createdAt: new Date() });
};

const createStudentProfile = async (userId, name, email) => {
  const existing = await db.collection('students').where('userId', '==', userId).limit(1).get();
  if (!existing.empty) {
    await existing.docs[0].ref.update({ status: true });
    return;
  }
  const { nombre, apaterno, amaterno } = splitName(name);
  await db.collection('students').add({ userId, nombre, apaterno, amaterno, email, status: true, createdAt: new Date() });
};

const deactivateProfile = async (collection, userId) => {
  const snap = await db.collection(collection).where('userId', '==', userId).limit(1).get();
  if (!snap.empty) await snap.docs[0].ref.update({ status: false });
};

// ─────────────────────────────────────────────────────────────────────────────

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
    createdAt: new Date(),
  };

  const savedUser = await userRepository.save(newUser);

  if (userData.role === 'teacher') await createTeacherProfile(savedUser.id, userData.name, userData.email);
  if (userData.role === 'student') await createStudentProfile(savedUser.id, userData.name, userData.email);

  await createAuditLog(adminId, 'CREATE_USER', {
    targetUserId: savedUser.id, email: savedUser.email, role: savedUser.role,
  });

  delete savedUser.password;
  return savedUser;
};

const updateUser = async (id, updateData, adminId) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  } else { delete updateData.password; }

  delete updateData.email;

  const newRole = updateData.role;
  const oldRole = user.role;

  if (newRole && newRole !== oldRole) {
    // ── Activar el perfil del nuevo rol ────────────────────────────────────
    if (newRole === 'teacher') await createTeacherProfile(id, user.name, user.email);
    if (newRole === 'student') await createStudentProfile(id, user.name, user.email);

    // ── Inactivar el perfil del rol anterior ───────────────────────────────
    if (oldRole === 'teacher') await deactivateProfile('teachers', id);
    if (oldRole === 'student') await deactivateProfile('students', id);
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

  // Sincronizar en ambas colecciones en paralelo
  const boolStatus = status === 'active';
  const [teacherSnap, studentSnap] = await Promise.all([
    db.collection('teachers').where('userId', '==', id).limit(1).get(),
    db.collection('students').where('userId', '==', id).limit(1).get(),
  ]);
  if (!teacherSnap.empty) await teacherSnap.docs[0].ref.update({ status: boolStatus });
  if (!studentSnap.empty) await studentSnap.docs[0].ref.update({ status: boolStatus });

  await createAuditLog(adminId, 'CHANGE_USER_STATUS', { targetUserId: id, newStatus: status });

  return { message: `El estado del usuario ahora es: ${status}` };
};

const deleteUser = async (id, adminId) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  await userRepository.remove(id);

  // Desenlazar ambos perfiles en paralelo (no borrar para preservar histórico)
  const [teacherSnap, studentSnap] = await Promise.all([
    db.collection('teachers').where('userId', '==', id).limit(1).get(),
    db.collection('students').where('userId', '==', id).limit(1).get(),
  ]);
  if (!teacherSnap.empty) await teacherSnap.docs[0].ref.update({ userId: null, status: false });
  if (!studentSnap.empty) await studentSnap.docs[0].ref.update({ userId: null, status: false });

  await createAuditLog(adminId, 'DELETE_USER', { targetUserId: id, email: user.email });

  return { message: 'Usuario eliminado permanentemente' };
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, changeUserStatus, deleteUser };