'use client';

import React, { useState } from 'react';
// TODO: These components don't exist - need to be created or use AuthTemplateNew instead
// import { HeroSection } from '@/components/organisms/auth/HeroSection';
// import { LoginPanel } from '@/components/organisms/auth/LoginPanel';
// import { SignupPanel } from '@/components/organisms/auth/SignupPanel';
import { SignupFormData } from '@/types/forms/auth';

type AuthMode = 'login' | 'signup';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthTemplateProps {
  // Common props
  mode?: AuthMode;
  heroImageUrl?: string;
  heroImageAlt?: string;
  loading?: boolean;
  
  // Login handlers
  onLogin?: (data: LoginFormData) => void | Promise<void>;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onForgotPassword?: () => void;
  
  // Signup handlers
  onSignup?: (data: SignupFormData) => void | Promise<void>;
  onGoogleSignup?: () => void;
  onFacebookSignup?: () => void;
  
  // Mode switching
  onSwitchToLogin?: () => void;
  onSwitchToSignup?: () => void;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  mode = 'login',
  heroImageUrl,
  heroImageAlt,
  loading = false,
  onLogin,
  onGoogleLogin,
  onFacebookLogin,
  onForgotPassword,
  onSignup,
  onGoogleSignup,
  onFacebookSignup,
  onSwitchToLogin,
  onSwitchToSignup
}) => {
  // TODO: This template is deprecated - components don't exist
  // Use AuthTemplateNew or /login, /signup pages instead
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">AuthTemplate (Deprecated)</h1>
        <p className="text-gray-600">
          This template is no longer maintained. Please use /login or /signup pages.
        </p>
      </div>
    </div>
  );
};

AuthTemplate.displayName = 'AuthTemplate';