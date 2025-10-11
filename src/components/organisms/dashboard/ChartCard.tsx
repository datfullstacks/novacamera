'use client';

import { ReactNode, HTMLAttributes } from 'react';
import Text from '../../atoms/Text';

interface ChartCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
  children: ReactNode;
}

export default function ChartCard({
  title,
  actionText,
  onActionClick,
  children,
  className = '',
  ...props
}: ChartCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-6">
        <Text variant="body" className="text-slate-800 text-lg font-normal">
          {title}
        </Text>
        {actionText && (
          <button
            onClick={onActionClick}
            className="text-blue-500 text-sm font-normal hover:text-blue-600 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
