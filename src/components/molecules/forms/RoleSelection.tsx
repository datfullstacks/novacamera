'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RoleOption {
  id: string;
  title: string;
  description: string;
  value: 'customer' | 'lessor';
}

interface RoleSelectionProps {
  value?: 'customer' | 'lessor';
  onChange?: (value: 'customer' | 'lessor') => void;
  className?: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'customer',
    title: 'Khách hàng',
    description: 'Thuê thiết bị',
    value: 'customer'
  },
  {
    id: 'lessor',
    title: 'Người cho thuê',
    description: 'Cho thuê thiết bị của bạn',
    value: 'lessor'
  }
];

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-4">
        {roleOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange?.(option.value)}
            className={cn(
              "flex-1 p-4 rounded-md border text-left transition-all duration-200",
              "hover:shadow-sm",
              value === option.value
                ? "bg-blue-500/5 border-blue-500 shadow-sm"
                : "bg-white border-gray-300 hover:border-gray-400"
            )}
          >
            <div className={cn(
              "font-bold text-sm leading-tight mb-1",
              value === option.value ? "text-gray-800" : "text-gray-800"
            )}>
              {option.title}
            </div>
            <div className="text-gray-500 text-xs leading-none">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};