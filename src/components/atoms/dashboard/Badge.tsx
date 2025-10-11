'use client';

import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant: 'rented' | 'available' | 'maintenance' | 'urgent' | 'scheduled';
  children: React.ReactNode;
}

export default function Badge({
  variant,
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    rented: 'bg-orange-600/10 text-orange-600',
    available: 'bg-lime-600/10 text-lime-600',
    maintenance: 'bg-yellow-400/10 text-yellow-400',
    urgent: 'bg-yellow-400/10 text-yellow-400',
    scheduled: 'bg-yellow-400/10 text-yellow-400',
  };

  return (
    <div
      className={`px-3 py-1 rounded-[20px] text-xs font-normal ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

