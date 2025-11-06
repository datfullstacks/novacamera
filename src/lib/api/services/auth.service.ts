import { apiClient } from '../client';
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  CreateUserOfflineRequest,
  LoginApiResponse,
  RegisterApiResponse,
  CurrentUserResponse,
  ChangePasswordResponse,
  UpdateProfileResponse,
  UploadAvatarResponse,
  UserListResponse,
  CreateOfflineUserResponse,
  UserInvoicesResponse,
} from '@/types/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginApiResponse> => {
    const response = await apiClient.post<LoginApiResponse['data']>('/Auth/login', credentials as unknown as Record<string, unknown>);
    return response;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterApiResponse> => {
    const response = await apiClient.post<RegisterApiResponse['data']>('/Auth/register', data as unknown as Record<string, unknown>);
    return response;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await apiClient.post<ChangePasswordResponse['data']>('/Auth/change-password', data as unknown as Record<string, unknown>);
    return response;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get<CurrentUserResponse['data']>('/User/me');
    return response;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await apiClient.patch<UpdateProfileResponse['data']>('/User/profile', data as unknown as Record<string, unknown>);
    return response;
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append('File', file);
    
    const response = await apiClient.put<UploadAvatarResponse['data']>('/User/avatar', formData);
    return response;
  },

  /**
   * Get user invoices
   */
  getUserInvoices: async (): Promise<UserInvoicesResponse> => {
    const response = await apiClient.get<UserInvoicesResponse['data']>('/User/invoices');
    return response;
  },

  /**
   * Get all users (admin)
   */
  getUsers: async (params?: { pageNumber?: number; pageSize?: number }): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse['data']>('/User', { params });
    return response;
  },

  /**
   * Create offline user (staff only)
   */
  createOfflineUser: async (data: CreateUserOfflineRequest): Promise<CreateOfflineUserResponse> => {
    const response = await apiClient.post<CreateOfflineUserResponse['data']>('/User/offline', data as unknown as Record<string, unknown>);
    return response;
  },

 
};
