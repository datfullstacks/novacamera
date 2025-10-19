/**
 * Form Data Types for Authentication Forms
 */

// Signup Form Data - New version with firstName/lastName
export interface SignupFormDataNew {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

// Signup Form Data - Legacy version with name and userType
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  userType: 'customer' | 'renter';
  agreeToTerms: boolean;
}

// Login Form Data
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Change Password Form Data
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Forgot Password Form Data
export interface ForgotPasswordFormData {
  email: string;
}

// Reset Password Form Data
export interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
