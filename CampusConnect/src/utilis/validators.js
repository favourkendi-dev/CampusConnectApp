export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('One special character');
  return { isValid: errors.length === 0, errors };
};

export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,30}$/;
  return regex.test(username);
};

export const validatePhone = (phone) => {
  const regex = /^\+?[\d\s-]{10,}$/;
  return regex.test(phone);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateFile = (file, maxSize = 10 * 1024 * 1024, allowedTypes = []) => {
  if (file.size > maxSize) {
    return { isValid: false, error: `File too large. Max ${maxSize / 1024 / 1024}MB` };
  }
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type' };
  }
  return { isValid: true };
};

export const sanitizeInput = (input) => {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 5000);
};