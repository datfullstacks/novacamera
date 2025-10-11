'use client';

import { HTMLAttributes, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingSearchBar } from '../../molecules/booking';
import BookingTable from './BookingTable';
import { ActionButton } from '../../atoms/equipment';

interface Booking {
  readonly id: string;
  readonly orderCode: string;
  readonly customerName: string;
  readonly equipment: string;
  readonly timeRange: string;
  readonly status: 'renting' | 'confirmed' | 'returned' | 'cancelled';
  readonly deliveryStatus: 'delivered' | 'not-delivered';
}

interface BookingManagementProps extends HTMLAttributes<HTMLDivElement> {
  readonly bookings: ReadonlyArray<Booking>;
  readonly onViewBooking?: (booking: Booking) => void;
  readonly onEditBooking?: (booking: Booking) => void;
  readonly onCancelBooking?: (booking: Booking) => void;
  readonly onConfirmBooking?: (booking: Booking) => void;
  readonly onDeliverBooking?: (booking: Booking) => void;
  readonly onReturnBooking?: (booking: Booking) => void;
  readonly onCreateBooking?: () => void;
}

export default function BookingManagement({
  bookings,
  onViewBooking,
  onEditBooking,
  onCancelBooking,
  onConfirmBooking,
  onDeliverBooking,
  onReturnBooking,
  onCreateBooking,
  className = '',
  ...props
}: BookingManagementProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = searchValue === '' || 
      booking.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      booking.orderCode.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = activeFilters.status === 'all' || activeFilters.status === booking.status;
    const matchesDelivery = activeFilters.deliveryStatus === 'all' || activeFilters.deliveryStatus === booking.deliveryStatus;

    return matchesSearch && matchesStatus && matchesDelivery;
  });

  const handleFilterApply = (filters: Record<string, string>) => {
    setActiveFilters(filters);
  };

  const handleFilterReset = () => {
    setActiveFilters({});
  };

  const handleCreateBooking = () => {
    router.push('/bookings/create');
    onCreateBooking?.();
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt chỗ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý và theo dõi tất cả đặt chỗ trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ActionButton
            variant="primary"
            onClick={handleCreateBooking}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Tạo đặt chỗ thủ công
          </ActionButton>
        </div>
      </div>

      {/* Search and Filters */}
      <BookingSearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilterApply={handleFilterApply}
        onFilterReset={handleFilterReset}
      />

      {/* Bookings Table */}
      <BookingTable
        bookings={filteredBookings}
        onView={onViewBooking}
        onEdit={onEditBooking}
        onCancel={onCancelBooking}
        onConfirm={onConfirmBooking}
        onDeliver={onDeliverBooking}
        onReturn={onReturnBooking}
      />
    </div>
  );
}
