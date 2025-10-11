'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface FormInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, onChange, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;

