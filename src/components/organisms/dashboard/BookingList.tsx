'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';
import { BookingItem } from '../../molecules/dashboard';

interface Booking {
  id: string;
  day: number;
  month: string;
  customerName: string;
  equipment: string;
  time: string;
}

interface BookingListProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
  bookings: Booking[];
}

export default function BookingList({
  title,
  actionText,
  onActionClick,
  bookings,
  className = '',
  ...props
}: BookingListProps) {
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
        {bookings.map((booking) => (
          <BookingItem
            key={booking.id}
            day={booking.day}
            month={booking.month}
            customerName={booking.customerName}
            equipment={booking.equipment}
            time={booking.time}
          />
        ))}
      </div>
    </div>
  );
}
