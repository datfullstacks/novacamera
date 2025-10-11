'use client';

import { HTMLAttributes } from 'react';

interface BookingCardProps extends HTMLAttributes<HTMLDivElement> {
  customerName: string;
  orderCode: string;
  dateRange: string;
  duration: string;
  status: string;
  contact: string;
}

export default function BookingCard({
  customerName,
  orderCode,
  dateRange,
  duration,
  status,
  contact,
  className = '',
  ...props
}: BookingCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-zinc-200 p-4 ${className}`} {...props}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-bold text-zinc-800 leading-snug">
          {customerName} (Mã đơn: {orderCode})
        </h3>
        <span className="text-gray-500 text-sm font-normal leading-tight">
          {dateRange}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-gray-500 text-sm font-normal leading-tight mb-1">
            Thời gian thuê
          </p>
          <p className="text-zinc-800 text-base font-normal leading-snug">
            {duration}
          </p>
        </div>
        
        <div>
          <p className="text-gray-500 text-sm font-normal leading-tight mb-1">
            Trạng thái
          </p>
          <p className="text-zinc-800 text-base font-normal leading-snug">
            {status}
          </p>
        </div>
        
        <div>
          <p className="text-gray-500 text-sm font-normal leading-tight mb-1">
            Liên hệ
          </p>
          <p className="text-zinc-800 text-base font-normal leading-snug">
            {contact}
          </p>
        </div>
      </div>
    </div>
  );
}

