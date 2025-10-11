'use client';

import { HTMLAttributes, useState } from 'react';
import { ActionButton } from '../../atoms/equipment';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterPanelProps extends HTMLAttributes<HTMLDivElement> {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onApply: (filters: Record<string, any>) => void;
  readonly onReset: () => void;
}

const statusOptions: FilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Có sẵn', value: 'available' },
  { label: 'Đang thuê', value: 'rented' },
  { label: 'Bảo trì', value: 'maintenance' },
  { label: 'Sửa chữa', value: 'repair' },
];

const priceRanges: FilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Dưới 500k', value: 'under-500' },
  { label: '500k - 1M', value: '500-1000' },
  { label: '1M - 2M', value: '1000-2000' },
  { label: 'Trên 2M', value: 'over-2000' },
];

const usageRanges: FilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Dưới 50%', value: 'under-50' },
  { label: '50% - 80%', value: '50-80' },
  { label: '80% - 95%', value: '80-95' },
  { label: 'Trên 95%', value: 'over-95' },
];

export default function FilterPanel({
  isOpen,
  onClose,
  onApply,
  onReset,
  className = '',
  ...props
}: FilterPanelProps) {
  const [filters, setFilters] = useState({
    status: 'all',
    priceRange: 'all',
    usageRange: 'all',
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
      priceRange: 'all',
      usageRange: 'all',
    });
    onReset();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`} {...props}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <button 
          className="fixed inset-0 bg-black bg-opacity-25" 
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          type="button"
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
            {/* Trạng thái */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Trạng thái
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

            {/* Khoảng giá */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Khoảng giá
                </legend>
                <div className="space-y-2">
                  {priceRanges.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={option.value}
                        checked={filters.priceRange === option.value}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Tần suất sử dụng */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Tần suất sử dụng
                </legend>
                <div className="space-y-2">
                  {usageRanges.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="usageRange"
                        value={option.value}
                        checked={filters.usageRange === option.value}
                        onChange={(e) => handleFilterChange('usageRange', e.target.value)}
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
