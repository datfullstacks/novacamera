'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordToggleProps {
  show: boolean;
  onToggle: () => void;
  className?: string;
}

export const PasswordToggle: React.FC<PasswordToggleProps> = ({ 
  show, 
  onToggle, 
  className = '' 
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded transition-colors duration-200 ${className}`}
      tabIndex={-1}
    >
      {show ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  );
};