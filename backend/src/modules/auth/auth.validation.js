const validateRegister = (data) => {
  if (!data.name || !data.email || !data.password) {
    return { error: 'Todos los campos (name, email, password) son obligatorios' };
  }
  return { error: null };
};

const validateLogin = (data) => {
  if (!data.email || !data.password) {
    return { error: 'Email y contraseña son obligatorios' };
  }
  return { error: null };
};

const validateChangePassword = (currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    return { error: 'Ambas contraseñas son requeridas' };
  }
  return { error: null };
};

module.exports = { 
  validateRegister, 
  validateLogin, 
  validateChangePassword 
};