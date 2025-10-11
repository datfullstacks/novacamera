'use client';

import React, { useState, useEffect } from 'react';
import { SignupTemplate } from '@/components/templates/SignupTemplate';
import { SignupFormData } from '@/components/molecules/auth/SignupForm';
import { showToast } from '@/components/atoms/ui/Toast';
import { useRegister } from '@/hooks/api/useAuth';
import { mapSignupFormToRegisterRequest } from '@/utils/auth';
import { ApiClientError } from '@/lib/api/client';

export default function SignupPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const registerMutation = useRegister();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSignup = async (data: SignupFormData) => {
    try {
      // Map form data to API request format
      const registerRequest = mapSignupFormToRegisterRequest(data);
      
      // Call API using React Query mutation
      const result = await registerMutation.mutateAsync(registerRequest);
      
      console.log('Signup successful:', result);
      
      showToast({
        type: 'success',
        title: 'Đăng ký thành công!',
        message: `Chào mừng bạn đến với Nova Camera, ${result.fullName}!`,
        duration: 3000,
      });

      // Redirect after successful signup
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại';
      
      if (error && typeof error === 'object' && 'apiMessage' in error) {
        errorMessage = (error as { apiMessage: string }).apiMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showToast({
        type: 'error',
        title: 'Đăng ký thất bại',
        message: errorMessage,
        duration: 4000,
      });
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup');
    showToast({
      type: 'info',
      title: 'Tính năng đang phát triển',
      message: 'Đăng ký với Google sẽ sớm được hỗ trợ',
      duration: 3000,
    });
  };

  const handleFacebookSignup = () => {
    console.log('Facebook signup');
    showToast({
      type: 'info',
      title: 'Tính năng đang phát triển',
      message: 'Đăng ký với Facebook sẽ sớm được hỗ trợ',
      duration: 3000,
    });
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <SignupTemplate
      onSignup={handleSignup}
      onGoogleSignup={handleGoogleSignup}
      onFacebookSignup={handleFacebookSignup}
      onLogin={handleLogin}
      loading={registerMutation.isPending}
      heroImageUrl="/images/auth-hero.jpg"
      heroImageAlt="Nova Camera Equipment"
    />
  );
}
