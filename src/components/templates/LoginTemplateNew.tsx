'use client';

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AuthHeroSection } from '@/components/organisms/auth/AuthHeroSection';
import { LoginFormNew } from '@/components/molecules/auth/LoginFormNew';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginTemplateProps {
  onLogin: (data: LoginFormData) => void | Promise<void>;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export const LoginTemplateNew: React.FC<LoginTemplateProps> = ({
  onLogin,
  onGoogleLogin,
  onFacebookLogin,
  onForgotPassword,
  onSignUp,
  loading = false,
  heroImageUrl,
  heroImageAlt
}) => {
  return (
    <AuthLayout
      heroSection={
        <AuthHeroSection 
          imageUrl={heroImageUrl}
          imageAlt={heroImageAlt}
        />
      }
      quote="Thuê thiết bị. Nắm bắt khoảnh khắc."
      quoteAuthor="Được tin tưởng bởi hàng ngàn người tạo."
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-800 leading-10">
            Đăng nhập vào Nova Camera 📸
          </h1>
          <p className="text-sm text-gray-500 leading-tight">
            Chào mừng quay trở lại! Hãy đăng nhập để tiếp tục
          </p>
        </div>

        {/* Login Form (includes social login and forgot password) */}
        <LoginFormNew 
          onLogin={onLogin}
          onGoogleLogin={onGoogleLogin}
          onFacebookLogin={onFacebookLogin}
          onForgotPassword={onForgotPassword}
          loading={loading}
        />

        {/* Signup Link */}
        <div className="text-center">
          <span className="text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={onSignUp}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Đăng ký ngay
            </button>
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};