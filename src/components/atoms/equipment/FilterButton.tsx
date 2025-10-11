'use client';

import { HTMLAttributes } from 'react';

interface FilterButtonProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
  children: React.ReactNode;
}

export default function FilterButton({
  active = false,
  count,
  children,
  className = '',
  ...props
}: FilterButtonProps) {
  return (
    <button
      className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 border-blue-200 text-blue-700'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      } ${className}`}
      {...props}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {count}
        </span>
      )}
    </button>
  );
}

