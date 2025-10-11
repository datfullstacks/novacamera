'use client';

import { HTMLAttributes } from 'react';
import { BookingTableRow } from '../../molecules/booking';

interface Booking {
  readonly id: string;
  readonly orderCode: string;
  readonly customerName: string;
  readonly equipment: string;
  readonly timeRange: string;
  readonly status: 'renting' | 'confirmed' | 'returned' | 'cancelled';
  readonly deliveryStatus: 'delivered' | 'not-delivered';
}

interface BookingTableProps extends HTMLAttributes<HTMLDivElement> {
  readonly bookings: ReadonlyArray<Booking>;
  readonly onView?: (booking: Booking) => void;
  readonly onEdit?: (booking: Booking) => void;
  readonly onCancel?: (booking: Booking) => void;
  readonly onConfirm?: (booking: Booking) => void;
  readonly onDeliver?: (booking: Booking) => void;
  readonly onReturn?: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  onView,
  onEdit,
  onCancel,
  onConfirm,
  onDeliver,
  onReturn,
  className = '',
  ...props
}: BookingTableProps) {
  return (
    <div className={`bg-white shadow overflow-hidden sm:rounded-md ${className}`} {...props}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thiết bị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  Không có đặt chỗ nào
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <BookingTableRow
                  key={booking.id}
                  booking={booking}
                  onView={onView}
                  onEdit={onEdit}
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                  onDeliver={onDeliver}
                  onReturn={onReturn}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

