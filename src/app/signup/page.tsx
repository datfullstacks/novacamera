'use client';

import React, { useState, useEffect } from 'react';
import { AuthTemplate } from '@/components/templates/AuthTemplateNew';
import { SignupFormNew } from '@/components/molecules/auth/SignupFormNew';
import { showToast } from '@/components/atoms/ui/Toast';
import { useRegister } from '@/hooks/api/useAuth';
import { ApiClientError } from '@/lib/api/client';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

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
      const registerRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      };
      
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
      
      if (error instanceof ApiClientError) {
        errorMessage = error.apiMessage || errorMessage;
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

  return (
    <AuthTemplate
      title="Tạo tài khoản"
      subtitle="Tham gia Nova Camera để thuê thiết bị nhiếp ảnh chuyên nghiệp"
      footerText="Đã có tài khoản?"
      footerLinkText="Đăng nhập ngay"
      footerLinkHref="/login"
      heroImageUrl="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=800&fit=crop"
      heroImageAlt="Nova Camera Equipment"
    >
      <SignupFormNew
        onSignup={handleSignup}
        onGoogleSignup={handleGoogleSignup}
        onFacebookSignup={handleFacebookSignup}
        loading={registerMutation.isPending}
      />
    </AuthTemplate>
  );
}
