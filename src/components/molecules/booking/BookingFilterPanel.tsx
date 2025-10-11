'use client';

import { HTMLAttributes, useState } from 'react';
import { ActionButton } from '../../atoms/equipment';

interface FilterOption {
  readonly label: string;
  readonly value: string;
  readonly count?: number;
}

interface BookingFilterPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly isOpen: boolean;
  readonly onClose: () => void;
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

export default function BookingFilterPanel({
  isOpen,
  onClose,
  onApply,
  onReset,
  className = '',
  ...props
}: BookingFilterPanelProps) {
  const [filters, setFilters] = useState({
    status: 'all',
    deliveryStatus: 'all',
    dateRange: 'all',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      status: 'all',
      deliveryStatus: 'all',
      dateRange: 'all',
    });
    onReset();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`} {...props}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <button 
          type="button"
          className="fixed inset-0 bg-black bg-opacity-25" 
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          aria-label="Close filter panel"
        />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Bộ lọc nâng cao</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Trạng thái đặt chỗ */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Trạng thái đặt chỗ
                </legend>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={filters.status === option.value}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Trạng thái giao hàng */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Trạng thái giao hàng
                </legend>
                <div className="space-y-2">
                  {deliveryOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryStatus"
                        value={option.value}
                        checked={filters.deliveryStatus === option.value}
                        onChange={(e) => handleFilterChange('deliveryStatus', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Khoảng thời gian */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Khoảng thời gian
                </legend>
                <div className="space-y-2">
                  {dateRangeOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="dateRange"
                        value={option.value}
                        checked={filters.dateRange === option.value}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <ActionButton
              variant="secondary"
              onClick={handleReset}
            >
              Đặt lại
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handleApply}
            >
              Áp dụng
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

