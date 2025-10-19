import { ApiResponse, PaginatedApiResponse } from './base';

// User roles enum
export enum UserRole {
  ADMIN = 1,
  RENTER = 2,    // Người cho thuê
  CUSTOMER = 3,  // Khách hàng
}

// User status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// Auth requests
export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string; // Will be hashed on backend
  phoneNumber?: string;
  roleId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string | null;
  newPassword: string | null;
}

export interface UpdateProfileRequest {
  fullName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  updatedAt?: string;
}

export interface CreateUserOfflineRequest {
  fullName: string;
  phoneNumber: string;
}

// User Response
export interface UserResponse {
  fullName: string | null;
  email: string | null;
  passwordHash?: string | null;
  phoneNumber: string | null;
  loyaltyPoints: number;
  avatarUrl: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  status: string | null;
  invoiceId: number;
  invoiceAmount: number;
  invoiceDate: string | null;
  totaltransactions: number;
  roleName: string | null;
}

// User Profile (extended)
export interface UserProfile extends UserResponse {
  userId: number;
}

// Auth responses
export interface RegisterResponse {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
  token?: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken?: string;
  roleId: number;
  roleName: string;
  expiresIn?: number;
}

// API Response Types
export type UserListResponse = PaginatedApiResponse<UserResponse>;
export type UserDetailResponse = ApiResponse<UserResponse>;
export type LoginApiResponse = ApiResponse<LoginResponse>;
export type RegisterApiResponse = ApiResponse<RegisterResponse>;
export type CurrentUserResponse = ApiResponse<UserProfile>;
export type UpdateProfileResponse = ApiResponse<UserProfile>;
export type ChangePasswordResponse = ApiResponse<string>;
export type UploadAvatarResponse = ApiResponse<{ avatarUrl: string }>;
export type CreateOfflineUserResponse = ApiResponse<UserResponse>;