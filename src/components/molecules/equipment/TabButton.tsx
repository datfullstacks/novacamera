'use client';

import { HTMLAttributes } from 'react';

interface TabButtonProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export default function TabButton({
  active = false,
  children,
  className = '',
  ...props
}: TabButtonProps) {
  return (
    <button
      className={`px-5 py-2 text-sm font-normal transition-colors ${
        active
          ? 'text-blue-500 border-b-2 border-blue-500'
          : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

