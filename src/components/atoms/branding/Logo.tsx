'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  variant = 'dark', 
  size = 'md' 
}) => {
  const textColors = {
    light: 'text-white',
    dark: 'text-gray-800'
  };

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn(
      'font-normal font-["ABeeZee"] leading-loose',
      textColors[variant],
      sizes[size],
      className
    )}>
    <img src="/logo.png" alt="Logo" className="h-auto w-auto" />
    </div>
  );
};