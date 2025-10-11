'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  countryCode?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, countryCode = "+84", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className={cn(
            "block text-sm font-medium text-gray-800",
            error && "text-red-600"
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 text-sm">{countryCode}</span>
          </div>
          
          <input
            type="tel"
            ref={ref}
            className={cn(
              "w-full h-12 pl-16 pr-4 text-sm transition-all",
              "bg-white border border-gray-300 rounded-lg",
              "placeholder:text-gray-400 hover:border-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';