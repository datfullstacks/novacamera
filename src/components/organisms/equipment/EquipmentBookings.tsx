'use client';

import { HTMLAttributes } from 'react';
import { BookingCard } from '../../molecules/equipment';

interface Booking {
  readonly id: string;
  readonly customerName: string;
  readonly orderCode: string;
  readonly dateRange: string;
  readonly duration: string;
  readonly status: string;
  readonly contact: string;
}

interface EquipmentBookingsProps extends HTMLAttributes<HTMLDivElement> {
  bookings: ReadonlyArray<Booking>;
}

export default function EquipmentBookings({
  bookings,
  className = '',
  ...props
}: EquipmentBookingsProps) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <h3 className="text-lg font-bold text-zinc-800 leading-relaxed">
        Chi tiết đặt chỗ
      </h3>
      
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có đặt chỗ nào
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              customerName={booking.customerName}
              orderCode={booking.orderCode}
              dateRange={booking.dateRange}
              duration={booking.duration}
              status={booking.status}
              contact={booking.contact}
            />
          ))
        )}
      </div>
    </div>
  );
}

