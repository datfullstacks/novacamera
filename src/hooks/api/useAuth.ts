import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction, updateTokens } from '@/store/slices/authSlice';
import { authService } from '@/lib/api';
import { 
  RegisterRequest, 
  LoginRequest, 
  RegisterResponse, 
  LoginResponse,
  UserProfile 
} from '@/types/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { 
  setAuthToken as setCookieAuthToken, 
  getAuthToken as getCookieAuthToken, 
  setRefreshToken as setCookieRefreshToken, 
  getRefreshToken as getCookieRefreshToken,
  setTokenExpiry as setCookieTokenExpiry,
  getTokenExpiry as getCookieTokenExpiry,
  clearAuthCookies,
  isTokenExpired as isCookieTokenExpired,
  getAuthDataFromCookies 
} from '@/lib/utils/cookies';

// Query keys for caching
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  user: (id: number) => [...authKeys.all, 'user', id] as const,
} as const;

// Utility functions for token management
const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
};

// Register mutation hook
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      // Send data directly - backend will hash password
      const response = await authService.register(data);
      return response.data;
    },
    onSuccess: (data: RegisterResponse) => {
      // Invalidate auth queries after successful registration
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      
      // Optional: Store user info in cache
      queryClient.setQueryData(authKeys.user(data.userId), data);
    },
    onError: (error: ApiClientError) => {
      console.error('Registration failed:', error);
    },
  });
};

// Login mutation hook with Redux integration
export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      dispatch(loginStart());
      const response = await authService.login(data);
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      console.log('🔑 Login API Response:', data);
      
      // Extract token expiry from JWT
      const tokenExpiry = getTokenExpiry(data.accessToken);
      console.log('🕒 Token expiry:', tokenExpiry ? new Date(tokenExpiry) : 'No expiry');
      
      // Store tokens in cookies instead of localStorage
      console.log('🍪 Saving accessToken to cookies...');
      setCookieAuthToken(data.accessToken, tokenExpiry || undefined);
      console.log('✅ AccessToken saved to cookie');
      
      if (data.refreshToken) {
        setCookieRefreshToken(data.refreshToken);
        console.log('✅ RefreshToken saved to cookie');
      }
      
      if (tokenExpiry) {
        setCookieTokenExpiry(tokenExpiry);
        console.log('✅ Token expiry saved to cookie');
      }
      
      // Update Redux state
      const user = {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        roleId: data.roleId,
        roleName: data.roleName,
      };
      
      console.log('🏪 Updating Redux state with user:', user);
      dispatch(loginSuccess({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || undefined,
        tokenExpiry: tokenExpiry || undefined,
      }));
      
      // Set user profile in React Query cache
      const userProfile: UserProfile = {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        roleId: data.roleId,
        roleName: data.roleName || null,
        phoneNumber: null,
        loyaltyPoints: 0,
        avatarUrl: null,
        address: null,
        status: 'active',
        invoiceId: 0,
        invoiceAmount: 0,
        invoiceDate: null,
        totaltransactions: 0,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData(authKeys.profile(), userProfile);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error: ApiClientError) => {
      console.error('Login failed:', error);
      dispatch(loginFailure(error.apiMessage || 'Login failed'));
    },
  });
};

// Get user profile query hook
export const useProfile = (token?: string) => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const authToken = token || getCookieAuthToken();
      if (!authToken) throw new Error('No auth token');
      
      const response = await authService.getProfile(authToken);
      return response.data;
    },
    enabled: !!token || !!getCookieAuthToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof ApiClientError && error.statusCode === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Logout mutation hook with Redux integration
export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      const token = getCookieAuthToken();
      if (token) {
        await authService.logout();
      }
    },
    onSuccess: () => {
      console.log('🍪 Clearing auth cookies...');
      // Clear cookies instead of localStorage
      clearAuthCookies();
      
      // Update Redux state
      dispatch(logoutAction());
      
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear(); // Optional: clear all queries
      
      console.log('✅ Logout completed - cookies and Redux cleared');
    },
    onError: (error: ApiClientError) => {
      console.error('❌ Logout API failed:', error);
      // Still clear cookies and Redux even if API logout fails
      console.log('🍪 Clearing auth cookies (fallback)...');
      clearAuthCookies();
      dispatch(logoutAction());
      queryClient.removeQueries({ queryKey: authKeys.all });
      console.log('✅ Local logout completed despite API error');
    },
  });
};

// Forgot password mutation hook
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await authService.forgotPassword({ email });
    },
    onSuccess: () => {
      // Could show success toast here
    },
    onError: (error: ApiClientError) => {
      console.error('Forgot password failed:', error);
    },
  });
};

// Hook to get authentication state from Redux with token validation
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  // Check if token is expired using cookie utility
  const isExpired = isCookieTokenExpired();
  
  // If we have a token but it's expired, logout
  React.useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken && isExpired) {
      console.log('🕒 Token expired, logging out...');
      dispatch(logoutAction());
      clearAuthCookies();
    }
  }, [auth.isAuthenticated, auth.accessToken, isExpired, dispatch]);
  
  return {
    ...auth,
    isTokenExpired: isExpired,
    isValidSession: auth.isAuthenticated && !isExpired,
  };
};

// Hook to automatically restore auth state on app load
export const useAuthRestore = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  
  React.useEffect(() => {
    // Only run once when app loads and we're not already authenticated
    if (!auth.isAuthenticated) {
      const cookieData = getAuthDataFromCookies();
      
      if (cookieData.authToken) {
        const tokenExpiry = getCookieTokenExpiry();
        const isExpired = isCookieTokenExpired();
        
        if (!isExpired) {
          // Token is still valid, restore session
          console.log('🔄 Restoring valid session from cookies...');
          dispatch(updateTokens({
            accessToken: cookieData.authToken,
            refreshToken: cookieData.refreshToken || undefined,
            tokenExpiry: tokenExpiry || undefined,
          }));
        } else {
          // Token expired, clear cookies
          console.log('🕒 Token expired on restore, clearing cookies...');
          clearAuthCookies();
        }
      }
    }
  }, [dispatch, auth.isAuthenticated]);
};