const validateRoleInput = (data) => {
  if (!data.name) {
    return { error: 'El nombre del rol es obligatorio' };
  }
  return { error: null };
};

module.exports = validateRoleInput;