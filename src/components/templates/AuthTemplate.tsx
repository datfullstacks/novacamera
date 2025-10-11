'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/organisms/auth/HeroSection';
import { LoginPanel } from '@/components/organisms/auth/LoginPanel';
import { SignupPanel } from '@/components/organisms/auth/SignupPanel';
import { SignupFormData } from '@/components/molecules/auth/SignupForm';

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
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode);

  const handleSwitchToLogin = () => {
    setCurrentMode('login');
    onSwitchToLogin?.();
  };

  const handleSwitchToSignup = () => {
    setCurrentMode('signup');
    onSwitchToSignup?.();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] h-[600px] bg-white rounded-xl shadow-[0px_10px_25px_0px_rgba(0,0,0,0.05)] overflow-hidden flex">
        {/* Hero Section */}
        <HeroSection 
          imageUrl={heroImageUrl}
          imageAlt={heroImageAlt}
        />
        
        {/* Auth Panel - Dynamic based on mode */}
        {currentMode === 'login' ? (
          <LoginPanel
            onLogin={onLogin}
            onGoogleLogin={onGoogleLogin}
            onFacebookLogin={onFacebookLogin}
            onForgotPassword={onForgotPassword}
            onSignUp={handleSwitchToSignup}
            loading={loading}
          />
        ) : (
          <SignupPanel
            onSignup={onSignup || (() => {})}
            onGoogleSignup={onGoogleSignup || (() => {})}
            onFacebookSignup={onFacebookSignup || (() => {})}
            onLogin={handleSwitchToLogin}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

AuthTemplate.displayName = 'AuthTemplate';