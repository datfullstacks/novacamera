'use client';

import { HTMLAttributes, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar, FilterPanel } from '../../molecules/equipment';
import EquipmentTable from './EquipmentTable';
import { ActionButton } from '../../atoms/equipment';

interface Equipment {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly status: 'available' | 'rented' | 'maintenance' | 'repair';
  readonly price: string;
  readonly usage: string;
  readonly image?: string;
}

interface EquipmentManagementProps extends HTMLAttributes<HTMLDivElement> {
  readonly equipment: ReadonlyArray<Equipment>;
  readonly onAddEquipment?: () => void;
  readonly onEditEquipment?: (equipment: Equipment) => void;
  readonly onDeleteEquipment?: (equipment: Equipment) => void;
  readonly onViewEquipment?: (equipment: Equipment) => void;
  readonly pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export default function EquipmentManagement({
  equipment,
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment,
  onViewEquipment,
  pagination,
  className = '',
  ...props
}: EquipmentManagementProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | number | boolean>>({});
  const [filterCount, setFilterCount] = useState(0);

  // Filter equipment based on search and filters
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = searchValue === '' || 
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.code.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = !activeFilters.status || activeFilters.status === 'all' || activeFilters.status === item.status;

    const matchesPrice = (() => {
      if (!activeFilters.priceRange || activeFilters.priceRange === 'all') return true;
      
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      switch (activeFilters.priceRange) {
        case 'under-500':
          return price < 500000;
        case '500-1000':
          return price >= 500000 && price < 1000000;
        case '1000-2000':
          return price >= 1000000 && price < 2000000;
        case 'over-2000':
          return price >= 2000000;
        default:
          return true;
      }
    })();

    const matchesUsage = (() => {
      if (!activeFilters.usageRange || activeFilters.usageRange === 'all') return true;
      
      const usage = parseInt(item.usage.replace('%', ''));
      switch (activeFilters.usageRange) {
        case 'under-50':
          return usage < 50;
        case '50-80':
          return usage >= 50 && usage < 80;
        case '80-95':
          return usage >= 80 && usage < 95;
        case 'over-95':
          return usage >= 95;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesPrice && matchesUsage;
  });

  console.log('🔍 EquipmentManagement Filter Debug:', {
    totalEquipment: equipment.length,
    filteredCount: filteredEquipment.length,
    searchValue,
    activeFilters,
  });

  const handleFilterApply = (filters: Record<string, string | number | boolean>) => {
    setActiveFilters(filters);
    const count = Object.values(filters).filter(value => value !== 'all').length;
    setFilterCount(count);
  };

  const handleFilterReset = () => {
    setActiveFilters({});
    setFilterCount(0);
  };

  const handleAddEquipment = () => {
    router.push('/equipment/add');
    onAddEquipment?.();
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thiết bị</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý và theo dõi tất cả thiết bị trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ActionButton
            variant="primary"
            onClick={handleAddEquipment}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Thêm thiết bị mới
          </ActionButton>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onAdvancedFilterClick={() => setIsFilterOpen(true)}
        filterCount={filterCount}
      />

      {/* Equipment Table */}
      <EquipmentTable
        equipment={filteredEquipment}
        onEdit={onEditEquipment}
        onDelete={onDeleteEquipment}
        onView={onViewEquipment}
        pagination={pagination}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />
    </div>
  );
}
