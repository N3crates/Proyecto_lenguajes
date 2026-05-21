const getPermissions = (req, res) => {
  // Lista dura de permisos del sistema EduControl
  const permissions = [
    { id: 'manage_users', name: 'Gestionar Usuarios', module: 'Admin' },
    { id: 'manage_roles', name: 'Gestionar Roles', module: 'Admin' },
    { id: 'view_audit', name: 'Ver Auditoría', module: 'Admin' },
    { id: 'manage_teachers', name: 'Gestionar Docentes', module: 'Escolar' },
    { id: 'manage_students', name: 'Gestionar Alumnos', module: 'Escolar' },
    { id: 'manage_grades', name: 'Gestionar Calificaciones', module: 'Académico' },
    { id: 'manage_groups', name: 'Gestionar Grupos', module: 'Académico' },
    { id: 'view_dashboard', name: 'Ver Dashboard', module: 'General' }
  ];

  res.status(200).json({
    success: true,
    message: 'Permisos obtenidos correctamente',
    data: permissions
  });
};

module.exports = { getPermissions };