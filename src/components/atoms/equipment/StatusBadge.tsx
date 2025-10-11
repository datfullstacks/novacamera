'use client';

import { HTMLAttributes } from 'react';

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: 'available' | 'rented' | 'maintenance' | 'repair';
  children?: React.ReactNode;
}

export default function StatusBadge({
  status,
  children,
  className = '',
  ...props
}: StatusBadgeProps) {
  const statusConfig = {
    available: {
      label: 'Có sẵn',
      className: 'bg-green-100 text-green-800',
    },
    rented: {
      label: 'Đang thuê',
      className: 'bg-blue-100 text-blue-800',
    },
    maintenance: {
      label: 'Bảo trì',
      className: 'bg-yellow-100 text-yellow-800',
    },
    repair: {
      label: 'Sửa chữa',
      className: 'bg-red-100 text-red-800',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}
      {...props}
    >
      {children || config.label}
    </span>
  );
}

