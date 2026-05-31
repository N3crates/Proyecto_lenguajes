const getPermissions = (req, res) => {
  const permissions = [
    // Admin
    { id: 'manage_users',    name: 'Gestionar Usuarios',       module: 'Admin'     },
    { id: 'manage_roles',    name: 'Gestionar Roles',          module: 'Admin'     },
    { id: 'view_audit',      name: 'Ver Auditoría',            module: 'Admin'     },
    // Escolar
    { id: 'manage_teachers', name: 'Gestionar Docentes',       module: 'Escolar'   },
    { id: 'manage_students', name: 'Gestionar Alumnos',        module: 'Escolar'   },
    { id: 'manage_enrollments', name: 'Gestionar Inscripciones', module: 'Escolar' },
    // Académico
    { id: 'manage_subjects', name: 'Gestionar Materias',       module: 'Académico' },
    { id: 'manage_groups',   name: 'Gestionar Grupos',         module: 'Académico' },
    { id: 'manage_grades',   name: 'Gestionar Calificaciones', module: 'Académico' },
    // Vistas propias (teacher/student)
    { id: 'view_own_groups', name: 'Ver Mis Grupos',           module: 'Docente'   },
    //{ id: 'capture_grades',  name: 'Capturar Calificaciones',  module: 'Docente'   },
    { id: 'view_own_grades', name: 'Ver Mis Calificaciones',   module: 'Estudiante'},
    { id: 'view_enrollments',name: 'Ver Mis Inscripciones',    module: 'Estudiante'},
    // General
    { id: 'view_dashboard',  name: 'Ver Dashboard',            module: 'General'   },
  ];

  res.status(200).json({ success: true, message: 'Permisos obtenidos correctamente', data: permissions });
};

module.exports = { getPermissions };