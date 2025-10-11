import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Server-side authentication guard
 * Checks for auth token in cookies and redirects if not found
 */
export default async function AuthGuard({ 
  children, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;
  
  if (!authToken) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}

/**
 * Hook to check authentication on server side
 * Returns auth status and user data if available
 */
export async function getServerAuth() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;
  const userDataCookie = cookieStore.get('userData')?.value;
  
  const isAuthenticated = !!authToken;
  
  let userData = null;
  if (userDataCookie) {
    try {
      userData = JSON.parse(userDataCookie);
    } catch (error) {
      console.error('Failed to parse user data from cookie:', error);
    }
  }
  
  return {
    isAuthenticated,
    userData,
    authToken
  };
}