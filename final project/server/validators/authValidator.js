function validateRegister(body) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.push('Valid email is required');
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  return { valid: errors.length === 0, errors };
}

function validateLogin(body) {
  const errors = [];
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.push('Valid email is required');
  }
  // For login, only require a password to be present (don't enforce min length)
  if (!body.password || typeof body.password !== 'string') {
    errors.push('Password is required');
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateRegister, validateLogin };
