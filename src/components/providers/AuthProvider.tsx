'use client';

import React from 'react';
import { useAuthRestore } from '@/hooks/api/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that handles authentication state restoration
 * and token validation on app initialization
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Automatically restore auth state from localStorage on app load
  useAuthRestore();
  
  return <>{children}</>;
};

AuthProvider.displayName = 'AuthProvider';