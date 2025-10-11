'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';

interface BookingItemProps extends HTMLAttributes<HTMLDivElement> {
  readonly day: number;
  readonly month: string;
  readonly customerName: string;
  readonly equipment: string;
  readonly time: string;
}

export default function BookingItem({
  day,
  month,
  customerName,
  equipment,
  time,
  className = '',
  ...props
}: BookingItemProps) {
  return (
    <div
      className={`flex items-start py-3 lg:py-4 border-b border-slate-200 last:border-b-0 ${className}`}
      {...props}
    >
      <div className="w-12 h-16 lg:w-14 lg:h-20 mr-3 lg:mr-4 flex-shrink-0 text-center">
        <Text variant="body" className="text-slate-800 text-lg lg:text-xl font-normal leading-relaxed">
          {day}
        </Text>
        <Text variant="caption" className="text-slate-500 text-xs uppercase">
          {month}
        </Text>
      </div>
      
      <div className="flex-1 min-w-0">
        <Text variant="body" className="text-slate-800 text-sm lg:text-base font-normal mb-1 truncate">
          {customerName}
        </Text>
        <Text variant="caption" className="text-slate-500 text-xs lg:text-sm mb-1 line-clamp-2">
          {equipment}
        </Text>
        <Text variant="caption" className="text-slate-500 text-xs">
          {time}
        </Text>
      </div>
    </div>
  );
}
