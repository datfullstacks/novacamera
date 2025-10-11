'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';
import { Badge } from '../../atoms/dashboard';

interface EquipmentItemProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  price: string;
  usage: string;
  status: 'rented' | 'available' | 'maintenance';
  image?: string;
}

export default function EquipmentItem({
  name,
  price,
  usage,
  status,
  image,
  className = '',
  ...props
}: EquipmentItemProps) {
  const statusLabels = {
    rented: 'Thuê',
    available: 'Có sẵn',
    maintenance: 'BẢO TRÌ',
  };

  return (
    <div
      className={`flex items-center py-3 lg:py-4 border-b border-slate-200 last:border-b-0 ${className}`}
      {...props}
    >
      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden mr-3 lg:mr-4 flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">IMG</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <Text variant="body" className="text-slate-800 text-sm lg:text-base font-normal mb-1 truncate">
          {name}
        </Text>
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-1 lg:space-y-0">
          <Text variant="caption" className="text-slate-500 text-xs lg:text-sm">
            Giá cho thuê: {price}
          </Text>
          <Text variant="caption" className="text-slate-500 text-xs lg:text-sm">
            Sử dụng: {usage}
          </Text>
        </div>
      </div>
      
      <Badge variant={status} className="ml-2 lg:ml-4 flex-shrink-0">
        {statusLabels[status]}
      </Badge>
    </div>
  );
}
