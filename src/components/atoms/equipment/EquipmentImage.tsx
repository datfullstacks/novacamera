'use client';

import { HTMLAttributes } from 'react';

interface EquipmentImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  status?: 'available' | 'rented' | 'maintenance' | 'repair';
  className?: string;
}

export default function EquipmentImage({
  src,
  alt,
  status = 'available',
  className = '',
  ...props
}: EquipmentImageProps) {
  const statusConfig = {
    available: {
      label: 'Có sẵn',
      className: 'bg-green-500/90 text-white',
    },
    rented: {
      label: 'Đang thuê',
      className: 'bg-blue-500/90 text-white',
    },
    maintenance: {
      label: 'Bảo trì',
      className: 'bg-yellow-500/90 text-white',
    },
    repair: {
      label: 'Sửa chữa',
      className: 'bg-red-500/90 text-white',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`relative ${className}`} {...props}>
      <div className="w-80 h-80 rounded-lg shadow-[0px_2px_10px_0px_rgba(0,0,0,0.10)] overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-[20px] ${config.className}`}>
        <span className="text-xs font-normal">{config.label}</span>
      </div>
    </div>
  );
}

