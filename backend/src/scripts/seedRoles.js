const db = require('../config/firebase');

const roles = [
  {
    name: 'admin',
    description: 'Acceso total al sistema',
    permissions: [
      'view_dashboard', 'manage_users', 'manage_roles',
      'manage_teachers', 'manage_students', 'manage_enrollments',
      'manage_subjects', 'manage_groups', 'manage_grades', 'view_audit',
    ],
    createdAt: new Date()
  },
  {
    name: 'teacher',
    description: 'Gestión de grupos y calificaciones',
    permissions: [
      'view_dashboard', 'view_own_groups', 'manage_grades',
    ],
    createdAt: new Date()
  },
  {
    name: 'student',
    description: 'Consulta de estatus y calificaciones',
    permissions: [
      'view_dashboard', 'view_own_grades', 'view_enrollments',
    ],
    createdAt: new Date()
  },
];

const seed = async () => {
  for (const role of roles) {
    // Verifica si ya existe para no duplicar
    const existing = await db.collection('roles')
      .where('name', '==', role.name)
      .limit(1)
      .get();

    if (existing.empty) {
      await db.collection('roles').add(role);
      console.log(`✓ Rol '${role.name}' creado`);
    } else {
      // Si existe, actualiza sus permisos
      await existing.docs[0].ref.update({
        permissions: role.permissions,
        description: role.description
      });
      console.log(`↺ Rol '${role.name}' actualizado`);
    }
  }
  console.log('✓ Seed completado');
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });