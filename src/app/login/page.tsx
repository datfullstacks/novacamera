'use client';

import React, { useState, useEffect } from 'react';
import { LoginTemplate } from '@/components/templates/LoginTemplate';
import { showToast } from '@/components/atoms/ui/Toast';
import { useLogin } from '@/hooks/api/useAuth';
import { ApiClientError } from '@/lib/api/client';

import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel';
import { getAuthDataFromCookies } from '@/lib/utils/cookies';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const loginMutation = useLogin();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleLogin = async (data: LoginFormData) => {
    try {
      console.log('🚀 Starting login process with:', { email: data.email, password: '***' });
      
      // Use real API call
      const result = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      
      console.log('🎉 Login API response received:', result);
      console.log('🔍 Checking cookies immediately after API call:');
      console.log('- Checking cookie data...');
      
      // Wait a bit for cookies to be set
      setTimeout(() => {
        const cookieData = getAuthDataFromCookies();
        console.log('- Cookie authToken:', cookieData.authToken?.substring(0, 50) + '...');
        console.log('- Cookie refreshToken exists:', !!cookieData.refreshToken);
        console.log('- Cookie isAuthenticated:', cookieData.isAuthenticated);
      }, 100);
      
      showToast({
        type: 'success',
        title: 'Đăng nhập thành công!',
        message: `Chào mừng bạn, ${result.fullName}!`,
        duration: 3000,
      });

      // Redirect after successful login
      setTimeout(() => {
        console.log('🔄 Redirecting to rental page...');
        window.location.href = '/rental';
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Đăng nhập thất bại';
      if (error instanceof ApiClientError) {
        errorMessage = error.apiMessage || errorMessage;
      }
      
      showToast({
        type: 'error',
        title: 'Lỗi đăng nhập',
        message: errorMessage,
        duration: 5000,
      });
    }
  };

  const handleGoogleLogin = () => {
    showToast({
      type: 'info',
      title: 'Google Login',
      message: 'Chức năng đang được phát triển',
      duration: 3000,
    });
  };

  const handleFacebookLogin = () => {
    showToast({
      type: 'info',
      title: 'Facebook Login',
      message: 'Chức năng đang được phát triển',
      duration: 3000,
    });
  };

  const handleForgotPassword = () => {
    showToast({
      type: 'info',
      title: 'Quên mật khẩu',
      message: 'Chức năng đang được phát triển',
      duration: 3000,
    });
  };

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  return (
    <>      
      <LoginTemplate
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
        loading={loginMutation.isPending}
        heroImageUrl="https://picsum.photos/id/1/480/600"
        heroImageAlt="Professional camera equipment for rental"
      />
      
      {/* Debug Panel */}
      <AuthDebugPanel />
    </>
  );
}
