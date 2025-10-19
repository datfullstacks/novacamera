'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { getAuthDataFromCookies } from '@/lib/utils/cookies';
import { useLogout } from '@/hooks/api/useAuth';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';

// Navigation Component with Auth Check
export const AuthNavbar = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const logoutMutation = useLogout();
  const router = useRouter();
  const [cookieData, setCookieData] = useState<{
    authToken: string | undefined;
    refreshToken: string | undefined;
    tokenExpiry: number | undefined;
    isAuthenticated: boolean;
  }>({
    authToken: undefined,
    refreshToken: undefined,
    tokenExpiry: undefined,
    isAuthenticated: false,
  });

  const updateCookieData = () => {
    const data = getAuthDataFromCookies();
    setCookieData(data);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    updateCookieData();
  }, [authState]);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                NovaCMS
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Trang chủ
            </Link>
            <Link href="/rental" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Thuê thiết bị
            </Link>

            {/* Authentication-based Navigation */}
            {authState.isAuthenticated && cookieData.isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <span className="text-sm text-gray-600">
                  Xin chào, <span className="font-medium">{authState.user?.fullName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Đăng nhập
                </Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-t border-yellow-300 px-4 py-2 text-xs">
          <span className="text-yellow-800">
            🔧 Redux Auth: {authState.isAuthenticated ? '✅' : '❌'} | 
            Cookie Auth: {cookieData.isAuthenticated ? '✅' : '❌'} | 
            User: {authState.user?.fullName || 'N/A'}
          </span>
        </div>
      )}
    </nav>
  );
};

export const AuthDebugPanel = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const [cookieData, setCookieData] = useState<{
    authToken: string | undefined;
    refreshToken: string | undefined;
    tokenExpiry: number | undefined;
    isAuthenticated: boolean;
  }>({
    authToken: undefined,
    refreshToken: undefined,
    tokenExpiry: undefined,
    isAuthenticated: false,
  });

  const updateCookieData = () => {
    const data = getAuthDataFromCookies();
    setCookieData(data);
  };

  useEffect(() => {
    // Update cookie data on mount and when auth state changes
    updateCookieData();
    
    // Set up interval to refresh cookie data every 2 seconds for debugging
    const interval = setInterval(updateCookieData, 2000);
    
    return () => clearInterval(interval);
  }, [authState]);

  if (!authState.isAuthenticated && !cookieData.authToken) {
    return null; // Hide panel when not authenticated
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs">
      <h3 className="font-bold mb-2 text-green-400">🔧 Auth Debug Panel</h3>
      
      <div className="mb-3">
        <h4 className="font-semibold text-blue-300">Redux State:</h4>
        <div className="pl-2">
          <div>✅ isAuthenticated: <span className={authState.isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(authState.isAuthenticated)}</span></div>
          <div>🔑 accessToken: <span className="text-yellow-300">{authState.accessToken ? `${authState.accessToken.substring(0, 20)}...` : 'null'}</span></div>
          <div>🔄 refreshToken: <span className="text-yellow-300">{authState.refreshToken ? 'exists' : 'null'}</span></div>
          <div>👤 user: <span className="text-cyan-300">{authState.user?.fullName || 'null'}</span></div>
          <div>⏰ tokenExpiry: <span className="text-purple-300">{authState.tokenExpiry ? new Date(authState.tokenExpiry).toLocaleString() : 'null'}</span></div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-blue-300">🍪 Cookies:</h4>
        <div className="pl-2">
          <div>🔑 authToken: <span className="text-yellow-300">{cookieData.authToken ? `${cookieData.authToken.substring(0, 20)}...` : 'null'}</span></div>
          <div>🔄 refreshToken: <span className="text-yellow-300">{cookieData.refreshToken ? 'exists' : 'null'}</span></div>
          <div>⏰ tokenExpiry: <span className="text-purple-300">{cookieData.tokenExpiry ? new Date(cookieData.tokenExpiry).toLocaleString() : 'null'}</span></div>
          <div>✅ isAuthenticated: <span className={cookieData.isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(cookieData.isAuthenticated)}</span></div>
        </div>
      </div>

      <button 
        onClick={updateCookieData}
        className="mt-2 bg-blue-600 px-2 py-1 rounded text-xs"
      >
        🔄 Refresh
      </button>
    </div>
  );
};