const db = require('../../config/firebase');
const userRef = db.collection('users');

const findByEmail = async (email) => {
  const snapshot = await userRef.where('email', '==', email).get();
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

const findById = async (id) => {
  const doc = await userRef.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

const saveUser = async (userData) => {
  const docRef = await userRef.add(userData);
  return { id: docRef.id, ...userData };
};

const updatePassword = async (id, hashedPassword) => {
  await userRef.doc(id).update({ password: hashedPassword });
};

module.exports = { 
  findByEmail, 
  findById, 
  saveUser, 
  updatePassword 
};