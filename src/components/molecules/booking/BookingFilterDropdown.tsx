'use client';

import { HTMLAttributes, useState, useRef, useEffect } from 'react';
import { ActionButton } from '../../atoms/equipment';

interface FilterOption {
  readonly label: string;
  readonly value: string;
  readonly count?: number;
}

interface BookingFilterDropdownProps extends HTMLAttributes<HTMLDivElement> {
  readonly onApply: (filters: Record<string, any>) => void;
  readonly onReset: () => void;
}

const statusOptions: FilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang thuê', value: 'renting' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đã trả', value: 'returned' },
  { label: 'Đã hủy', value: 'cancelled' },
];

const deliveryOptions: FilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Chưa giao', value: 'not-delivered' },
];

const dateRangeOptions: FilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hôm nay', value: 'today' },
  { label: 'Tuần này', value: 'this-week' },
  { label: 'Tháng này', value: 'this-month' },
  { label: '3 tháng gần đây', value: 'last-3-months' },
];

export default function BookingFilterDropdown({
  onApply,
  onReset,
  className = '',
  ...props
}: BookingFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    deliveryStatus: 'all',
    dateRange: 'all',
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({
      status: 'all',
      deliveryStatus: 'all',
      dateRange: 'all',
    });
    onReset();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} {...props}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Bộ lọc nâng cao
        <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4">
            <div className="space-y-4">
              {/* Trạng thái đặt chỗ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái đặt chỗ
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trạng thái giao hàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái giao hàng
                </label>
                <select
                  value={filters.deliveryStatus}
                  onChange={(e) => handleFilterChange('deliveryStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {deliveryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Khoảng thời gian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng thời gian
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <ActionButton
                variant="secondary"
                onClick={handleReset}
                size="sm"
              >
                Đặt lại
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={handleApply}
                size="sm"
              >
                Áp dụng
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

