function validateProfile(body) {
  const errors = [];
  if (body.age !== undefined) {
    const age = Number(body.age);
    if (Number.isNaN(age) || age < 18 || age > 100) errors.push('Age must be between 18 and 100');
  }
  if (body.gender && !['male', 'female', 'other'].includes(body.gender)) {
    errors.push('Gender must be one of male, female, other');
  }
  if (body.interests && !Array.isArray(body.interests)) {
    errors.push('Interests must be an array of strings');
  }
  if (body.location) {
    if (typeof body.location !== 'object' || !body.location.city || !body.location.country) {
      errors.push('Location must have city and country');
    }
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateProfile };
