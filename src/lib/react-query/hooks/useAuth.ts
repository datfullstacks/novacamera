'use client';

/**
 * Authentication Query Hooks with Redux Integration
 * Custom hooks for authentication-related queries and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, clearError } from '@/store/slices/authSlice';
import { authService } from '@/lib/api';
import { QUERY_KEYS } from '../query-keys';
import type { LoginDto, RegisterDto, AuthUser, AuthResponse } from '@/types/auth';

/**
 * Get current authenticated user
 */
export function useCurrentUser() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: () => authService.getCurrentUser(),
    retry: false, // Don't retry on 401
    enabled: !!token && isAuthenticated,
  });
}

/**
 * Login mutation with Redux integration
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (credentials: LoginDto) => {
      dispatch(loginStart());
      return authService.login(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }
      
      // Update Redux state
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      const errorMessage = (error as any)?.response?.data?.message || 'Login failed';
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
    mutationFn: (data: RegisterDto) => {
      dispatch(loginStart());
      return authService.register(data);
    },
    onSuccess: (data: AuthResponse) => {
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }
      
      // Update Redux state
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      const errorMessage = (error as any)?.response?.data?.message || 'Registration failed';
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
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
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
        localStorage.removeItem('token');
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