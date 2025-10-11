'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  color?: 'default' | 'success' | 'warning' | 'error';
  height?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  color = 'default',
  height = 'sm'
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getHeightClasses = () => {
    switch (height) {
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
      default:
        return 'h-1';
    }
  };

  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn(
      "w-full bg-gray-200 rounded-full overflow-hidden",
      getHeightClasses(),
      className
    )}>
      <div
        className={cn(
          "transition-all duration-300 ease-out rounded-full",
          getColorClasses()
        )}
        style={{
          width: `${clampedValue}%`,
          height: '100%'
        }}
      />
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';