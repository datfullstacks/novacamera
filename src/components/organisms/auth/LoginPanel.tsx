'use client';

import React from 'react';
import { LoginForm } from '@/components/molecules/auth/LoginForm';
import { SocialLogin } from '@/components/molecules/auth/SocialLogin';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPanelProps {
  onLogin?: (data: LoginFormData) => void | Promise<void>;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({
  onLogin,
  onGoogleLogin,
  onFacebookLogin,
  onForgotPassword,
  onSignUp,
  loading = false
}) => {
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    if (onLogin) {
      await onLogin(data);
    } else {
      // Default behavior - redirect to rental page
      console.log('Login attempt:', data);
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/rental');
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      router.push('/forgot-password');
    }
  };

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="w-[540px] h-[600px] bg-white flex flex-col justify-start items-start p-10">
      {/* Header */}
      <div className="w-full mb-8">
        <h1 className="text-3xl font-normal font-['ABeeZee'] leading-9 text-gray-800 mb-4">
          Chào mừng trở lại
        </h1>
        <p className="text-base font-normal font-['ABeeZee'] leading-tight text-gray-500">
          Vui lòng nhập chi tiết của bạn để đăng nhập
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full mb-6">
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          onForgotPassword={handleForgotPassword}
        />
      </div>

      {/* Social Login */}
      <div className="w-full mb-6">
        <SocialLogin
          onGoogleLogin={onGoogleLogin}
          onFacebookLogin={onFacebookLogin}
          loading={loading}
        />
      </div>

      {/* Sign Up Link */}
      <div className="w-full text-center">
        <p className="text-sm font-normal font-['ABeeZee'] leading-tight text-gray-500">
          Không có tài khoản?{' '}
          <button
            onClick={handleSignUp}
            className="text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            Đăng ký
          </button>
        </p>
      </div>
    </div>
  );
};