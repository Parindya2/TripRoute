// utils/validation.ts

export interface ValidationError {
  field: string;
  message: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Validate login credentials
 */
export const validateLogin = (
  username: string,
  password: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!username.trim()) {
    errors.push({
      field: 'username',
      message: 'Username is required',
    });
  } else if (username.trim().length < 3) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 3 characters',
    });
  }

  if (!password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  } else if (password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
    });
  }

  return errors;
};

/**
 * Validate registration data
 */
export const validateRegister = (
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // First Name validation
  if (!firstName.trim()) {
    errors.push({
      field: 'firstName',
      message: 'First name is required',
    });
  } else if (firstName.trim().length < 2) {
    errors.push({
      field: 'firstName',
      message: 'First name must be at least 2 characters',
    });
  }

  // Last Name validation
  if (!lastName.trim()) {
    errors.push({
      field: 'lastName',
      message: 'Last name is required',
    });
  } else if (lastName.trim().length < 2) {
    errors.push({
      field: 'lastName',
      message: 'Last name must be at least 2 characters',
    });
  }

  // Email validation
  if (!email.trim()) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address',
    });
  }

  // Username validation
  if (!username.trim()) {
    errors.push({
      field: 'username',
      message: 'Username is required',
    });
  } else if (username.trim().length < 3) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 3 characters',
    });
  } else if (username.trim().length > 20) {
    errors.push({
      field: 'username',
      message: 'Username must be less than 20 characters',
    });
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push({
      field: 'username',
      message: 'Username can only contain letters, numbers, and underscores',
    });
  }

  // Password validation
  if (!password) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
    });
  }

  // Confirm Password validation
  if (!confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Please confirm your password',
    });
  } else if (password !== confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match',
    });
  }

  return errors;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};