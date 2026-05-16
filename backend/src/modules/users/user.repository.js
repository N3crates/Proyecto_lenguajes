const db = require('../../config/firebase');
const userRef = db.collection('users');

const findAll = async () => {
  const snapshot = await userRef.get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const findById = async (id) => {
  const doc = await userRef.doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

const findByEmail = async (email) => {
  const snapshot = await userRef.where('email', '==', email).get();
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

const save = async (userData) => {
  const docRef = await userRef.add(userData);
  return { id: docRef.id, ...userData };
};

const update = async (id, updateData) => {
  await userRef.doc(id).update({ ...updateData, updatedAt: new Date() });
};

const remove = async (id) => {
  await userRef.doc(id).delete();
};

module.exports = { 
  findAll, 
  findById, 
  findByEmail, 
  save, 
  update, 
  remove 
};