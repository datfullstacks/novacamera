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
  readonly status: 'pending' | 'confirmed' | 'renting' | 'returned' | 'cancelled';
  readonly deliveryStatus: 'delivered' | 'not-delivered';
}

interface PaginationInfo {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalCount: number;
  readonly pageSize: number;
  readonly onPageChange: (page: number) => void;
}

interface BookingManagementProps extends HTMLAttributes<HTMLDivElement> {
  readonly bookings: ReadonlyArray<Booking>;
  readonly onViewBooking?: (booking: Booking) => void;
  readonly onEditBooking?: (booking: Booking) => void;
  readonly onCancelBooking?: (booking: Booking) => void;
  readonly onDeliverBooking?: (booking: Booking) => void;
  readonly onReturnBooking?: (booking: Booking) => void;
  readonly onCreateBooking?: () => void;
  readonly pagination?: PaginationInfo;
}

export default function BookingManagement({
  bookings,
  onViewBooking,
  onEditBooking,
  onCancelBooking,
  onDeliverBooking,
  onReturnBooking,
  onCreateBooking,
  pagination,
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

    const matchesStatus = !activeFilters.status || activeFilters.status === 'all' || activeFilters.status === booking.status;
    const matchesDelivery = !activeFilters.deliveryStatus || activeFilters.deliveryStatus === 'all' || activeFilters.deliveryStatus === booking.deliveryStatus;

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
        onDeliver={onDeliverBooking}
        onReturn={onReturnBooking}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.pageSize + 1}
                </span>{' '}
                đến{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)}
                </span>{' '}
                trong tổng số{' '}
                <span className="font-medium">{pagination.totalCount}</span> đơn hàng
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                {/* Previous Button */}
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Trước</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page Numbers */}
                {(() => {
                  const pages = [];
                  const maxPagesToShow = 5;
                  let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
                  const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
                  
                  if (endPage - startPage + 1 < maxPagesToShow) {
                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => pagination.onPageChange(i)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                          i === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}

                {/* Next Button */}
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Sau</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
