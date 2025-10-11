'use client';

import { HTMLAttributes } from 'react';

interface ChecklistItemProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
  checked?: boolean;
}

export default function ChecklistItem({
  text,
  checked = true,
  className = '',
  ...props
}: ChecklistItemProps) {
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <div className="w-4 h-4 mr-3 flex items-center justify-center">
        {checked ? (
          <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-4 h-4 border border-gray-300 rounded-sm" />
        )}
      </div>
      <span className="text-base font-normal text-zinc-800 leading-snug">
        {text}
      </span>
    </div>
  );
}

