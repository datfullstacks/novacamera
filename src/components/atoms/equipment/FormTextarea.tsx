'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface FormTextareaProps extends Omit<HTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, value, placeholder, onChange, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;

