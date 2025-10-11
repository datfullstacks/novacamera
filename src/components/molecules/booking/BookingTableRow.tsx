'use client';

import { HTMLAttributes } from 'react';
import { BookingStatusBadge, BookingActionButton } from '../../atoms/booking';

interface Booking {
  readonly id: string;
  readonly orderCode: string;
  readonly customerName: string;
  readonly equipment: string;
  readonly timeRange: string;
  readonly status: 'renting' | 'confirmed' | 'returned' | 'cancelled';
  readonly deliveryStatus: 'delivered' | 'not-delivered';
}

interface BookingTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  readonly booking: Booking;
  readonly onView?: (booking: Booking) => void;
  readonly onEdit?: (booking: Booking) => void;
  readonly onCancel?: (booking: Booking) => void;
  readonly onConfirm?: (booking: Booking) => void;
  readonly onDeliver?: (booking: Booking) => void;
  readonly onReturn?: (booking: Booking) => void;
}

export default function BookingTableRow({
  booking,
  onView,
  onEdit,
  onCancel,
  onConfirm,
  onDeliver,
  onReturn,
  className = '',
  ...props
}: BookingTableRowProps) {
  const handleView = () => onView?.(booking);
  const handleEdit = () => onEdit?.(booking);
  const handleCancel = () => onCancel?.(booking);
  const handleConfirm = () => onConfirm?.(booking);
  const handleDeliver = () => onDeliver?.(booking);
  const handleReturn = () => onReturn?.(booking);

  const getAvailableActions = () => {
    const actions = [];
    
    // Always available
    actions.push({ action: 'view' as const, handler: handleView, label: 'Xem' });
    
    // Status-based actions
    switch (booking.status) {
      case 'confirmed':
        actions.push(
          { action: 'edit' as const, handler: handleEdit, label: 'Sửa' },
          { action: 'cancel' as const, handler: handleCancel, label: 'Hủy' },
          { action: 'deliver' as const, handler: handleDeliver, label: 'Giao hàng' }
        );
        break;
      case 'renting':
        actions.push(
          { action: 'edit' as const, handler: handleEdit, label: 'Sửa' },
          { action: 'return' as const, handler: handleReturn, label: 'Trả hàng' }
        );
        break;
      case 'returned':
        actions.push({ action: 'view' as const, handler: handleView, label: 'Xem' });
        break;
      case 'cancelled':
        actions.push({ action: 'view' as const, handler: handleView, label: 'Xem' });
        break;
    }
    
    return actions;
  };

  const availableActions = getAvailableActions();

  return (
    <tr className={`hover:bg-gray-50 ${className}`} {...props}>
      {/* Mã đơn */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {booking.orderCode}
      </td>

      {/* Khách hàng */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {booking.customerName}
      </td>

      {/* Thiết bị */}
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-xs truncate" title={booking.equipment}>
          {booking.equipment}
        </div>
      </td>

      {/* Thời gian */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {booking.timeRange}
      </td>

      {/* Trạng thái & Giao nhận */}
      <td className="px-6 py-4 whitespace-nowrap">
        <BookingStatusBadge
          status={booking.status}
          deliveryStatus={booking.deliveryStatus}
        />
      </td>

      {/* Thao tác */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          {availableActions.map((action, index) => (
            <BookingActionButton
              key={`${action.action}-${index}`}
              action={action.action}
              onClick={action.handler}
              size="sm"
            >
              {action.label}
            </BookingActionButton>
          ))}
        </div>
      </td>
    </tr>
  );
}

