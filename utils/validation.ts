export interface ValidationError {
  field: string;
  message: string;
}

export const validateLogin = (
  username: string,
  password: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!username.trim()) {
    errors.push({ field: 'username', message: 'Username is required' });
  } else if (username.length < 3) {
    errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return errors;
};

export const validateRegister = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!username.trim()) {
    errors.push({ field: 'username', message: 'Username is required' });
  }

  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push({ field: 'email', message: 'Email is invalid' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};