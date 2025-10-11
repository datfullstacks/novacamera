'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type UserRole = 'customer' | 'lessor';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  className?: string;
}

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    value: 'customer',
    label: 'Khách hàng',
    description: 'Thuê thiết bị'
  },
  {
    value: 'lessor',
    label: 'Người cho thuê',
    description: 'Cho thuê thiết bị của bạn'
  }
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-800">
        Tôi muốn:
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roleOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "p-4 rounded-lg border-2 text-left transition-all transform hover:scale-105",
              "hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              value === option.value
                ? "bg-blue-50 border-blue-500 shadow-md"
                : "bg-white border-gray-200 hover:bg-gray-50"
            )}
          >
            <div className="space-y-1">
              <div className={cn(
                "text-sm font-bold",
                value === option.value ? "text-blue-700" : "text-gray-800"
              )}>
                {option.label}
              </div>
              <div className="text-xs text-gray-500">
                {option.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

RoleSelector.displayName = 'RoleSelector';