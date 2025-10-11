import { ApiResponse } from './base';

// User roles enum
export enum UserRole {
  ADMIN = 1,
  RENTER = 2,    // Người cho thuê
  CUSTOMER = 3,  // Khách hàng
}

// Auth requests
export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
  roleId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth responses
export interface RegisterResponse {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
}

export interface LoginResponse {
  userId: number;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken: string | null;
  roleName: string;
  roleId: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// User profile
export interface UserProfile {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response types
export type AuthRegisterResponse = ApiResponse<RegisterResponse>;
export type AuthLoginResponse = ApiResponse<LoginResponse>;
export type AuthProfileResponse = ApiResponse<UserProfile>;
export type AuthRefreshResponse = ApiResponse<RefreshTokenResponse>;