'use client';

import { ReactNode, HTMLAttributes } from 'react';
import Text from '../Text';

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly title: string;
  readonly value: string | number;
  readonly change?: {
    readonly value: string;
    readonly type: 'positive' | 'negative' | 'neutral';
  };
  readonly icon?: ReactNode;
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  className = '',
  ...props
}: StatCardProps) {
  const changeStyles = {
    positive: 'text-lime-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] p-4 lg:p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <Text variant="caption" className="text-slate-500 text-xs lg:text-sm">
          {title}
        </Text>
        {icon && <div className="text-slate-400 w-4 h-4 lg:w-5 lg:h-5">{icon}</div>}
      </div>
      
      <Text as="h3" className="text-xl lg:text-3xl font-normal text-slate-800 mb-3 lg:mb-4">
        {value}
      </Text>
      
      {change && (
        <div className="flex items-center">
          <div className="w-3 h-3 lg:w-4 lg:h-4 mr-2">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 17l9.2-9.2M17 17V7H7"
              />
            </svg>
          </div>
          <Text
            variant="caption"
            className={`${changeStyles[change.type]} text-xs lg:text-sm`}
          >
            {change.value}
          </Text>
        </div>
      )}
    </div>
  );
}
