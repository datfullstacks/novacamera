'use client';

/**
 * Authentication Query Hooks with Redux Integration
 * Custom hooks for authentication-related queries and mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, clearError } from '@/store/slices/authSlice';
import { authService } from '@/lib/api';
import { QUERY_KEYS } from '../query-keys';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types/api/auth';
import type { ApiResponse } from '@/types/api';

/**
 * Login mutation with Redux integration
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => {
      dispatch(loginStart());
      return authService.login(credentials);
    },
    onSuccess: (response: ApiResponse<LoginResponse>) => {
      console.log('✅ Login API response:', response);
      
      const data = response.data;
      
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      }
      
      // Create user object for Redux
      const user = {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        roleId: data.roleId,
        roleName: data.roleName,
      };
      
      // Update Redux state
      dispatch(loginSuccess({ 
        user, 
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiry: data.expiresIn ? Date.now() + data.expiresIn * 1000 : undefined,
      }));
      
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('❌ Login error:', error);
      const errorMessage = error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
    },
  });
}

/**
 * Register mutation with Redux integration
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: RegisterRequest) => {
      dispatch(loginStart());
      return authService.register(data);
    },
    onSuccess: (response: ApiResponse<RegisterResponse>) => {
      console.log('✅ Registration API response:', response);
      
      const data = response.data;
      
      // For registration, we might get a token or need to redirect to login
      if (data.token) {
        // Store token if provided
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.token);
        }
        
        // Create user object for Redux
        const user = {
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
          roleId: data.roleId,
          roleName: '', // Will be fetched later
        };
        
        // Update Redux state
        dispatch(loginSuccess({ 
          user, 
          accessToken: data.token,
        }));
        
        // Invalidate auth queries
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // No token provided, redirect to login
        router.push('/login?registered=true');
      }
    },
    onError: (error: Error) => {
      console.error('❌ Registration error:', error);
      const errorMessage = error.message || 'Registration failed';
      dispatch(loginFailure(errorMessage));
    },
  });
}

/**
 * Logout mutation with Redux integration
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      
      // Update Redux state
      dispatch(logoutAction());
      
      // Clear all queries
      queryClient.clear();
      
      // Redirect to login
      router.push('/login');
    },
    onError: () => {
      // Even if API call fails, logout locally
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      dispatch(logoutAction());
      queryClient.clear();
      router.push('/login');
    },
  });
}

/**
 * Hook to get authentication state from Redux
 */
export function useAuth() {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    clearError: clearAuthError,
  };
}