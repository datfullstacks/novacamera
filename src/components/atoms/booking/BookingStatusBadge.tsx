'use client';

import { HTMLAttributes } from 'react';

type BookingStatus = 'renting' | 'confirmed' | 'returned' | 'cancelled';
type DeliveryStatus = 'delivered' | 'not-delivered';

interface BookingStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: BookingStatus;
  deliveryStatus?: DeliveryStatus;
}

const statusConfig = {
  renting: {
    label: 'Đang thuê',
    className: 'bg-blue-100 text-blue-800',
  },
  confirmed: {
    label: 'Đã xác nhận',
    className: 'bg-green-100 text-green-800',
  },
  returned: {
    label: 'Đã trả',
    className: 'bg-gray-100 text-gray-800',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-red-100 text-red-800',
  },
};

const deliveryConfig = {
  delivered: {
    label: 'Đã giao',
    className: 'bg-emerald-100 text-emerald-800',
  },
  'not-delivered': {
    label: 'Chưa giao',
    className: 'bg-orange-100 text-orange-800',
  },
};

export default function BookingStatusBadge({
  status,
  deliveryStatus,
  className = '',
  ...props
}: BookingStatusBadgeProps) {
  const statusInfo = statusConfig[status];
  const deliveryInfo = deliveryStatus ? deliveryConfig[deliveryStatus] : null;

  return (
    <div className={`flex flex-col space-y-1 ${className}`} {...props}>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
      {deliveryInfo && (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${deliveryInfo.className}`}>
          {deliveryInfo.label}
        </span>
      )}
    </div>
  );
}

