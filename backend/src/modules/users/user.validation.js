const validateCreateUser = (data) => {
  if (!data.name || !data.email || !data.password) {
    return { error: 'Faltan datos obligatorios (name, email o password)' };
  }
  return { error: null };
};

const validateStatus = (status) => {
  if (!status || (status !== 'active' && status !== 'inactive')) {
    return { error: 'El estado debe ser "active" o "inactive"' };
  }
  return { error: null };
};

module.exports = { 
  validateCreateUser, 
  validateStatus 
};
