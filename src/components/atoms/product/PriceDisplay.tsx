'use client';

import React from 'react';

export interface PriceDisplayProps {
  price: number;
  period?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  period = 'ngày',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <span className={`text-blue-600 font-normal ${sizeClasses[size]} ${className}`}>
      {price.toLocaleString('vi-VN')}đ/{period}
    </span>
  );
};