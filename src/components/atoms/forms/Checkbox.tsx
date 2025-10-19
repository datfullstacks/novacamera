'use client';

import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, checked, onChange, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              checked={checked}
              onChange={onChange}
              className={cn(
                "peer sr-only",
                className
              )}
              {...props}
            />
            <label 
              htmlFor={checkboxId}
              className={cn(
                "w-5 h-5 border-2 rounded border-gray-400 bg-gray-50 flex items-center justify-center transition-all duration-200 cursor-pointer",
                "peer-checked:bg-blue-600 peer-checked:border-blue-600",
                "peer-focus:ring-4 peer-focus:ring-blue-100 peer-focus:ring-offset-0",
                "hover:border-gray-500 hover:bg-gray-100",
                "peer-checked:hover:bg-blue-700",
                error && "border-red-400 bg-red-50"
              )}
            >
              <Check 
                className={cn(
                  "w-3 h-3 text-white transition-all duration-200",
                  "peer-checked:opacity-100 opacity-0"
                )}
              />
            </label>
          </div>
          
          {(label || description) && (
            <div className="flex-1 min-w-0">
              {label && (
                <label 
                  htmlFor={checkboxId}
                  className={cn(
                    "text-sm font-medium text-gray-900 cursor-pointer leading-5",
                    "hover:text-blue-600 transition-colors duration-200",
                    error && "text-red-600"
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-xs text-gray-500 mt-1">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-red-600 ml-8">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
