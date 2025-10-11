'use client';

import React, { useState, useEffect } from 'react';
import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { SignupFormData } from '@/components/molecules/auth/SignupForm';
import { showToast } from '@/components/atoms/ui/Toast';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

type AuthMode = 'login' | 'signup';

interface AuthPageProps {
  initialMode?: AuthMode;
}

export default function AuthPage({ initialMode = 'login' }: AuthPageProps = {}) {
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentMode, setCurrentMode] = useState<AuthMode>(initialMode);

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
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login data:', data);
      
      showToast({
        type: 'success',
        title: 'Đăng nhập thành công!',
        message: `Chào mừng bạn, ${data.email}`,
        duration: 3000,
      });

      // Redirect after successful login
      setTimeout(() => {
        window.location.href = '/rental';
      }, 1000);
      
    } catch (error) {
      console.error('Login error:', error);
      showToast({
        type: 'error',
        title: 'Đăng nhập thất bại',
        message: 'Email hoặc mật khẩu không đúng',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Signup data:', data);
      
      showToast({
        type: 'success',
        title: 'Đăng ký thành công!',
        message: 'Chào mừng bạn đến với Nova Camera',
        duration: 3000,
      });

      // Switch to login mode after successful signup
      setTimeout(() => {
        setCurrentMode('login');
        showToast({
          type: 'info',
          title: 'Hãy đăng nhập',
          message: 'Vui lòng đăng nhập bằng tài khoản vừa tạo',
          duration: 3000,
        });
      }, 1000);
      
    } catch (error) {
      console.error('Signup error:', error);
      showToast({
        type: 'error',
        title: 'Đăng ký thất bại',
        message: 'Có lỗi xảy ra, vui lòng thử lại',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log(`Google ${currentMode}`);
    showToast({
      type: 'info',
      title: 'Tính năng đang phát triển',
      message: `${currentMode === 'login' ? 'Đăng nhập' : 'Đăng ký'} với Google sẽ sớm được hỗ trợ`,
      duration: 3000,
    });
  };

  const handleFacebookAuth = () => {
    console.log(`Facebook ${currentMode}`);
    showToast({
      type: 'info',
      title: 'Tính năng đang phát triển',
      message: `${currentMode === 'login' ? 'Đăng nhập' : 'Đăng ký'} với Facebook sẽ sớm được hỗ trợ`,
      duration: 3000,
    });
  };

  const handleForgotPassword = () => {
    showToast({
      type: 'info',
      title: 'Tính năng đang phát triển',
      message: 'Tính năng quên mật khẩu sẽ sớm được hỗ trợ',
      duration: 3000,
    });
  };

  const handleSwitchToLogin = () => {
    setCurrentMode('login');
  };

  const handleSwitchToSignup = () => {
    setCurrentMode('signup');
  };

  return (
    <AuthTemplate
      mode={currentMode}
      loading={loading}
      heroImageUrl="/images/auth-hero.jpg"
      heroImageAlt="Nova Camera Equipment"
      // Login handlers
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleAuth}
      onFacebookLogin={handleFacebookAuth}
      onForgotPassword={handleForgotPassword}
      // Signup handlers
      onSignup={handleSignup}
      onGoogleSignup={handleGoogleAuth}
      onFacebookSignup={handleFacebookAuth}
      // Mode switching
      onSwitchToLogin={handleSwitchToLogin}
      onSwitchToSignup={handleSwitchToSignup}
    />
  );
}