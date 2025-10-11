'use client';

import React from 'react';
import { SignupForm, SignupFormData } from '@/components/molecules/auth/SignupForm';
import { SocialLogin } from '@/components/molecules/auth/SocialLogin';

interface SignupPanelProps {
  onSignup: (data: SignupFormData) => void | Promise<void>;
  onGoogleSignup: () => void;
  onFacebookSignup: () => void;
  onLogin: () => void;
  loading?: boolean;
}

export const SignupPanel: React.FC<SignupPanelProps> = ({
  onSignup,
  onGoogleSignup,
  onFacebookSignup,
  onLogin,
  loading = false
}) => {
  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <div className="max-w-md mx-auto px-8 py-12 space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-inter">
            Tạo tài khoản của bạn 🚀
          </h1>
          <p className="text-base text-gray-600 font-inter">
            Hãy bắt đầu hành trình nhiếp ảnh của bạn
          </p>
        </div>

        {/* Signup Form */}
        <div className="space-y-6">
          <SignupForm
            onSubmit={onSignup}
            loading={loading}
          />
        </div>

        {/* Social Login Divider */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-500 font-inter">
            Hoặc đăng ký với
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <SocialLogin
          onGoogleLogin={onGoogleSignup}
          onFacebookLogin={onFacebookSignup}
          googleText="Tiếp tục với Google"
          facebookText="Tiếp tục với Facebook"
        />

        {/* Login Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onLogin}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-inter"
          >
            Đã có một tài khoản? <span className="text-blue-600 hover:text-blue-700">Đăng nhập</span>
          </button>
        </div>
      </div>
    </div>
  );
};

SignupPanel.displayName = 'SignupPanel';