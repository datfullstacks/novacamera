'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface SearchInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = 'Tìm kiếm...', value, onChange, className = '', ...props }, ref) => {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder:text-gray-500"
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
