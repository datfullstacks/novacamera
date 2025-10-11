'use client';

import { HTMLAttributes } from 'react';

interface SpecRowProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  isHeader?: boolean;
}

export default function SpecRow({
  label,
  value,
  isHeader = false,
  className = '',
  ...props
}: SpecRowProps) {
  return (
    <div className={`w-full h-12 flex ${className}`} {...props}>
      <div className={`w-80 h-12 flex items-center px-4 border-b border-zinc-200 ${
        isHeader ? 'bg-gray-50' : ''
      }`}>
        <span className={`text-base leading-snug ${
          isHeader ? 'font-bold text-gray-500' : 'font-bold text-gray-500'
        }`}>
          {label}
        </span>
      </div>
      <div className={`flex-1 h-12 flex items-center px-4 border-b border-zinc-200 ${
        isHeader ? 'bg-gray-50' : ''
      }`}>
        <span className="text-base font-normal text-zinc-800 leading-snug">
          {value}
        </span>
      </div>
    </div>
  );
}

