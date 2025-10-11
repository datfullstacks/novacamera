'use client';

import React, { useState } from 'react';
import { Input } from '@/components/atoms/forms/Input';
import { PasswordField } from '@/components/molecules/forms/PasswordField';
import { Button } from '@/components/atoms/forms/Button';
import { Checkbox } from '@/components/atoms/forms/Checkbox';

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'customer' | 'renter';
  agreeToTerms: boolean;
}

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void | Promise<void>;
  loading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Only validate phone for renters (role 2), not customers (role 3)
    if (formData.userType === 'renter') {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!/^[0-9+\s-()]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Vui lòng đồng ý với điều khoản dịch vụ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = <K extends keyof SignupFormData>(
    field: K,
    value: SignupFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <Input
        label="Tên đầy đủ"
        type="text"
        placeholder="John Doe"
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        error={errors.name}
        disabled={loading}
      />

      {/* Email */}
      <Input
        label="Địa chỉ email"
        type="email"
        placeholder="John@ví dụ.com"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={errors.email}
        disabled={loading}
      />

      {/* Phone Number - Only show for renters */}
      {formData.userType === 'renter' && (
        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="+84 912 345 678"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          error={errors.phone}
          disabled={loading}
        />
      )}

      {/* Password */}
      <PasswordField
        label="Mật khẩu"
        placeholder="Ít nhất 6 ký tự"
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
        error={errors.password}
        disabled={loading}
      />

      {/* Confirm Password */}
      <PasswordField
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu của bạn"
        value={formData.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        disabled={loading}
      />

      {/* User Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900">Tôi muốn:</label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              formData.userType === 'customer'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100 shadow-sm'
                : 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-sm'
            }`}
            onClick={() => updateField('userType', 'customer')}
          >
            <div className="font-bold text-sm text-gray-900">Khách hàng</div>
            <div className="text-xs text-gray-600 mt-1">Thuê thiết bị</div>
          </div>
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              formData.userType === 'renter'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100 shadow-sm'
                : 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-sm'
            }`}
            onClick={() => updateField('userType', 'renter')}
          >
            <div className="font-bold text-sm text-gray-900">Người cho thuê</div>
            <div className="text-xs text-gray-600 mt-1">Cho thuê thiết bị của bạn</div>
          </div>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="space-y-2">
        <Checkbox
          checked={formData.agreeToTerms}
          onChange={(e) => updateField('agreeToTerms', e.target.checked)}
          label="Tôi đồng ý với các điều khoản của chính sách dịch vụ và quyền riêng tư"
          error={errors.agreeToTerms}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        Đăng ký
      </Button>
    </form>
  );
};

SignupForm.displayName = 'SignupForm';
