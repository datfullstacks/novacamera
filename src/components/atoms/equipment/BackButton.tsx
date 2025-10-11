'use client';

import { HTMLAttributes } from 'react';

interface BackButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function BackButton({
  onClick,
  children = 'Quay lại danh sách thiết bị',
  className = '',
  ...props
}: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center text-gray-500 text-sm font-normal hover:text-gray-700 transition-colors ${className}`}
      {...props}
    >
      <div className="w-4 h-4 mr-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      {children}
    </button>
  );
}

