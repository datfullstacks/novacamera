'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export const PasswordToggle: React.FC<PasswordToggleProps> = ({ visible, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded transition-colors duration-200"
      style={{ top: 'calc(50% + 12px)' }}
      tabIndex={-1}
    >
      {visible ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  );
};