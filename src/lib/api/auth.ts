import { apiClient } from './client';
import {
  RegisterRequest,
  LoginRequest,
  RegisterResponse,
  LoginResponse,
  UserProfile,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '@/types/api/auth';

// Auth API Service
export class AuthService {
  private readonly basePath = '/Auth';

  // Register new user
  async register(data: RegisterRequest) {
    return apiClient.post<RegisterResponse>(
      `${this.basePath}/register`,
      data as unknown as Record<string, unknown>
    );
  }

  // Login user
  async login(data: LoginRequest) {
    return apiClient.post<LoginResponse>(
      `${this.basePath}/login`,
      data as unknown as Record<string, unknown>
    );
  }

  // Get current user profile
  async getProfile(token: string) {
    return apiClient.get<UserProfile>(
      `${this.basePath}/profile`,
      { token }
    );
  }

  // Logout user
  async logout(): Promise<void> {
    await apiClient.post(
      `${this.basePath}/logout`
    );
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(
      `${this.basePath}/forgot-password`,
      data as unknown as Record<string, unknown>
    );
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest) {
    return apiClient.post(
      `${this.basePath}/reset-password`,
      data as unknown as Record<string, unknown>
    );
  }

  // Change password
  async changePassword(data: ChangePasswordRequest, token: string): Promise<void> {
    await apiClient.post(
      `${this.basePath}/change-password`,
      data as unknown as Record<string, unknown>,
      { token }
    );
  }

  // Refresh token
  async refreshToken(refreshToken: string) {
    return apiClient.post<LoginResponse>(
      `${this.basePath}/refresh-token`,
      { refreshToken }
    );
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post(
      `${this.basePath}/verify-email`,
      { token }
    );
  }

  // Resend verification email
  async resendVerification(email: string): Promise<void> {
    await apiClient.post(
      `${this.basePath}/resend-verification`,
      { email }
    );
  }
}

// Create singleton instance
export const authService = new AuthService();