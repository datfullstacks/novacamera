'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-900 leading-tight mb-2"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "w-full h-12 px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-300 text-gray-900 text-sm font-medium placeholder:text-gray-500 transition-all duration-200",
            "focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white",
            "hover:border-gray-400 hover:bg-white",
            "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";