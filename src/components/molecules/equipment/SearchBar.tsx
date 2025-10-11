'use client';

import { HTMLAttributes } from 'react';
import { SearchInput, FilterButton } from '../../atoms/equipment';

interface SearchBarProps extends HTMLAttributes<HTMLDivElement> {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdvancedFilterClick: () => void;
  filterCount?: number;
}

export default function SearchBar({
  searchValue,
  onSearchChange,
  onAdvancedFilterClick,
  filterCount = 0,
  className = '',
  ...props
}: SearchBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`} {...props}>
      <div className="flex-1">
        <SearchInput
          placeholder="Tìm kiếm theo tên / mã thiết bị"
          value={searchValue}
          onChange={onSearchChange}
          className="w-full"
        />
      </div>
      <FilterButton
        active={filterCount > 0}
        count={filterCount}
        onClick={onAdvancedFilterClick}
        className="whitespace-nowrap"
      >
        Bộ lọc nâng cao
      </FilterButton>
    </div>
  );
}

