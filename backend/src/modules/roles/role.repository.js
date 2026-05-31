const db = require('../../config/firebase');
const roleRef = db.collection('roles');

const findAll = async () => {
  const snapshot = await roleRef.get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const findByName = async (name) => {
  const snapshot = await roleRef.where('name', '==', name).get();
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

const findById = async (id) => {
  const doc = await roleRef.doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

const save = async (roleData) => {
  const docRef = await roleRef.add(roleData);
  return { id: docRef.id, ...roleData };
};

const update = async (id, roleData) => {
  await roleRef.doc(id).update({ ...roleData, updatedAt: new Date() });
};

const remove = async (id) => {
  await roleRef.doc(id).delete();
};

module.exports = { 
  findAll, 
  findByName, 
  findById, 
  save, 
  update, 
  remove 
};