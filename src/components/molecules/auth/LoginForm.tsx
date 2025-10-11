'use client';

import React, { useState } from 'react';
import { Input } from '@/components/atoms/forms/Input';
import { PasswordField } from '@/components/molecules/forms/PasswordField';
import { Button } from '@/components/atoms/forms/Button';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  loading?: boolean;
  onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  onForgotPassword
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Email Field */}
      <Input
        type="email"
        name="email"
        label="E-mail"
        placeholder="Nhập email của bạn"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />

      {/* Password Field */}
      <PasswordField
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="h-4 w-4 text-zinc-900 focus:ring-zinc-500 border-gray-300 rounded"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm text-gray-800 font-normal font-['ABeeZee'] leading-tight"
          >
            Nhớ tôi
          </label>
        </div>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-indigo-600 font-normal font-['ABeeZee'] leading-tight hover:text-indigo-500 focus:outline-none"
        >
          Quên mật khẩu?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading}
      >
        Đăng nhập
      </Button>
    </form>
  );
};