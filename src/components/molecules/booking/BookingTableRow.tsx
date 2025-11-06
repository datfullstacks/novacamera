'use client';

import { HTMLAttributes } from 'react';
import { BookingStatusBadge, BookingActionButton } from '../../atoms/booking';

interface Booking {
  readonly id: string;
  readonly orderCode: string;
  readonly customerName: string;
  readonly equipment: string;
  readonly timeRange: string;
  readonly status: 'pending' | 'confirmed' | 'renting' | 'returned' | 'cancelled';
  readonly deliveryStatus: 'delivered' | 'not-delivered';
}

interface BookingTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  readonly booking: Booking;
  readonly onView?: (booking: Booking) => void;
  readonly onEdit?: (booking: Booking) => void;
  readonly onCancel?: (booking: Booking) => void;
  readonly onDeliver?: (booking: Booking) => void;
  readonly onReturn?: (booking: Booking) => void;
}

export default function BookingTableRow({
  booking,
  onView,
  onEdit,
  onCancel,
  onDeliver,
  onReturn,
  className = '',
  ...props
}: BookingTableRowProps) {
  const handleView = () => onView?.(booking);
  const handleEdit = () => onEdit?.(booking);
  const handleCancel = () => onCancel?.(booking);
  const handleDeliver = () => onDeliver?.(booking);
  const handleReturn = () => onReturn?.(booking);

  const getAvailableActions = () => {
    const actions = [];
    
    // Always available
    actions.push({ action: 'view' as const, handler: handleView, label: 'Xem' });
    
    // Status-based actions
    switch (booking.status) {
      case 'pending':
        // Pending → Only cancel payment option
        actions.push(
          { action: 'cancel' as const, handler: handleCancel, label: 'Hủy thanh toán' }
        );
        break;
      case 'confirmed':
        // Confirmed → Rented or Cancelled
        actions.push(
          { action: 'edit' as const, handler: handleEdit, label: 'Sửa' },
          { action: 'deliver' as const, handler: handleDeliver, label: 'Giao hàng' },
          { action: 'cancel' as const, handler: handleCancel, label: 'Hủy' }
        );
        break;
      case 'renting':
        // Rented → Completed
        actions.push(
          { action: 'edit' as const, handler: handleEdit, label: 'Sửa' },
          { action: 'return' as const, handler: handleReturn, label: 'Trả hàng' }
        );
        break;
      case 'returned':
        // Final state - view only
        actions.push({ action: 'view' as const, handler: handleView, label: 'Xem' });
        break;
      case 'cancelled':
        // Final state - view only
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

      {/* Trạng thái */}
      <td className="px-6 py-4 whitespace-nowrap">
        <BookingStatusBadge
          status={booking.status}
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

