'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';
import { EquipmentItem } from '../../molecules/dashboard';

interface Equipment {
  id: string;
  name: string;
  price: string;
  usage: string;
  status: 'rented' | 'available' | 'maintenance';
  image?: string;
}

interface EquipmentListProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
  equipment: Equipment[];
}

export default function EquipmentList({
  title,
  actionText,
  onActionClick,
  equipment,
  className = '',
  ...props
}: EquipmentListProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] p-4 lg:p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <Text variant="body" className="text-slate-800 text-sm lg:text-base font-normal">
          {title}
        </Text>
        {actionText && (
          <button
            onClick={onActionClick}
            className="text-blue-500 text-xs lg:text-sm font-normal hover:text-blue-600 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
      
      <div className="space-y-0">
        {equipment.map((item) => (
          <EquipmentItem
            key={item.id}
            name={item.name}
            price={item.price}
            usage={item.usage}
            status={item.status}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}
