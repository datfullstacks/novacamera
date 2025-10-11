'use client';

import React from 'react';
import { HeroSection } from '@/components/organisms/auth/HeroSection';
import { LoginPanel } from '@/components/organisms/auth/LoginPanel';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginTemplateProps {
  onLogin?: (data: LoginFormData) => void | Promise<void>;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export const LoginTemplate: React.FC<LoginTemplateProps> = ({
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] h-[600px] bg-white rounded-xl shadow-[0px_10px_25px_0px_rgba(0,0,0,0.05)] overflow-hidden flex">
        {/* Hero Section */}
        <HeroSection 
          imageUrl={heroImageUrl}
          imageAlt={heroImageAlt}
        />
        
        {/* Login Panel */}
        <LoginPanel
          onLogin={onLogin}
          onGoogleLogin={onGoogleLogin}
          onFacebookLogin={onFacebookLogin}
          onForgotPassword={onForgotPassword}
          onSignUp={onSignUp}
          loading={loading}
        />
      </div>
    </div>
  );
};