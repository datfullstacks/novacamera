'use client';

import React from 'react';
import { HeroSection } from '@/components/organisms/auth/HeroSection';
import { SignupPanel } from '@/components/organisms/auth/SignupPanel';
import { SignupFormData } from '@/components/molecules/auth/SignupForm';

interface SignupTemplateProps {
  onSignup: (data: SignupFormData) => void | Promise<void>;
  onGoogleSignup: () => void;
  onFacebookSignup: () => void;
  onLogin: () => void;
  loading?: boolean;
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export const SignupTemplate: React.FC<SignupTemplateProps> = ({
  onSignup,
  onGoogleSignup,
  onFacebookSignup,
  onLogin,
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
        
        {/* Signup Panel */}
        <SignupPanel
          onSignup={onSignup}
          onGoogleSignup={onGoogleSignup}
          onFacebookSignup={onFacebookSignup}
          onLogin={onLogin}
          loading={loading}
        />
      </div>
    </div>
  );
};

SignupTemplate.displayName = 'SignupTemplate';
