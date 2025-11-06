import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenExpiry: number | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tokenExpiry: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ 
      user: User; 
      accessToken: string; 
      refreshToken?: string;
      tokenExpiry?: number;
    }>) => {
      console.log('🏪 Redux loginSuccess action called with:', action.payload);
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken || null;
      state.tokenExpiry = action.payload.tokenExpiry || null;
      state.isAuthenticated = true;
      state.error = null;
      console.log('✅ Redux state updated. isAuthenticated:', state.isAuthenticated);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      console.log('🏪 Redux logout action called');
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      console.log('✅ Redux state cleared - isAuthenticated:', state.isAuthenticated);
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTokens: (state, action: PayloadAction<{
      accessToken: string;
      refreshToken?: string;
      tokenExpiry?: number;
    }>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.tokenExpiry) {
        state.tokenExpiry = action.payload.tokenExpiry;
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateTokens, updateUser } = authSlice.actions;
export default authSlice.reducer;