const db = require('../../config/firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const register = async(userData) => {
  const {
    name,
    email,
    password
  } = userData;

  //-------VALIDAR CAMPOS---------------------------
  if (!name || !email || !password) {
    throw new Error('Todos los campos son obligatorios');
  }

  //------VERIFICAR SI USUARIO EXISTE---------------
  const userRef = db.collection('users');

  const snapshot = await userRef
    .where('email', '==', email)
    .get();
  
  if (!snapshot.empty) {
    throw new Error('El usuario ya existe');
  }

  //------HASH DE CONTRASENA------------------------
  const hashedPassword = await bcrypt.hash(password, 10);

  //------CREAR USUARIO------------------------------
  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date()
  };

  //------GUARDAR EN FIRESTORE------------------------
  const docRef = await userRef.add(newUser);

  return {
    id: docRef.id,
    name,
    email,
    role: 'user'
  };
};

const login = async (userData) => {
  const { email, password } = userData;

  //--------VALIDAR CAMPOS-----------------------------
  if (!email || !password) {
    throw new Error('Todos los campos son obligatorios');
  }

  //--------BUSCAR USUARIO-----------------------------
  const userRef = db.collection('users');

  const snapshot = await userRef
    .where('email', '==', email)
    .get();
  
  //-------VERIFICAR EXISTENCIA-------------------------
  if (snapshot.empty) {
    throw new Error('Credenciales invalidas');
  }

  //------OBTENER USUARIO-------------------------------
  const userDoc = snapshot.docs[0];

  const user = {
    id: userDoc.id,
    ...userDoc.data()
  };

  //------COMPARAR PASSWORD-----------------------------
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if(!isMatch) {
    throw new Error('Credenciales invalidas')
  }

  //-------GENERAR TOKEN--------------------------------
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '3h'
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};


const changePassword = async (userId, currentPassword, newPassword) => {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('Usuario no encontrado');
  }

  const user = userDoc.data();

  //-------Verificar que la contraseña actual sea correcta---------------
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('La contraseña actual es incorrecta');
  }

  //-------Encriptar la nueva contraseña---------------------------------
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  //-------Actualizar en la base de datos--------------------------------
  await userRef.update({
    password: hashedNewPassword
  });

  return { message: 'Contraseña actualizada correctamente' };
};

module.exports = {
  register,
  login,
  changePassword
};