'use client';

import { HTMLAttributes } from 'react';
import { BookingSearchInput } from '../../atoms/booking';
import BookingFilterDropdown from './BookingFilterDropdown';

interface BookingSearchBarProps extends HTMLAttributes<HTMLDivElement> {
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly onFilterApply: (filters: Record<string, string>) => void;
  readonly onFilterReset: () => void;
}

export default function BookingSearchBar({
  searchValue,
  onSearchChange,
  onFilterApply,
  onFilterReset,
  className = '',
  ...props
}: BookingSearchBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`} {...props}>
      <div className="flex-1">
        <BookingSearchInput
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex-shrink-0">
        <BookingFilterDropdown
          onApply={onFilterApply}
          onReset={onFilterReset}
        />
      </div>
    </div>
  );
}
