'use client';

import React, { useState } from 'react';
import { Input } from '@/components/atoms/forms/Input';
import { PasswordToggle } from '@/components/atoms/forms/PasswordToggle';

interface PasswordFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label = "Mật khẩu",
  placeholder = "•••••••••",
  value,
  onChange,
  error,
  name = "password",
  required = false,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <Input
        type={showPassword ? "text" : "password"}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        name={name}
        required={required}
        disabled={disabled}
        className="pr-12"
      />
      <PasswordToggle 
        show={showPassword} 
        onToggle={togglePasswordVisibility} 
      />
    </div>
  );
};