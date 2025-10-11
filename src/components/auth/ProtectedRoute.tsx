'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getAuthDataFromCookies } from '@/lib/utils/cookies';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Wrapper component that protects routes by checking authentication status
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ 
  children, 
  fallback = <div>Loading...</div>,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  
  // Get auth state from Redux
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = () => {
      // Check both Redux state and cookies
      const cookieData = getAuthDataFromCookies();
      const isAuthenticatedFromRedux = authState.isAuthenticated;
      const isAuthenticatedFromCookies = cookieData.isAuthenticated;
      
      // User is considered authenticated if both Redux and cookies agree
      const authenticated = isAuthenticatedFromRedux && isAuthenticatedFromCookies;
      
      console.log('🔐 ProtectedRoute Auth Check:', {
        reduxAuth: isAuthenticatedFromRedux,
        cookieAuth: isAuthenticatedFromCookies,
        finalAuth: authenticated,
        user: authState.user
      });

      if (!authenticated) {
        // Store current path for redirect after login
        const currentPath = window.location.pathname + window.location.search;
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
        
        console.log('🚫 User not authenticated, redirecting to:', loginUrl);
        router.replace(loginUrl);
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    // Small delay to ensure Redux state is properly hydrated
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [authState, router, redirectTo]);

  // Show loading while checking authentication
  if (isChecking) {
    return <>{fallback}</>;
  }

  // Show children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
}