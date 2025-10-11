'use client';

import React from 'react';
import { FilterGroup } from './FilterGroup';
import { ToggleSwitch } from '../../atoms/rental/ToggleSwitch';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateAvailability } from '@/store/slices/filtersSlice';

export interface AvailabilityFilterProps {
  title?: string;
  className?: string;
}

export const AvailabilityFilter: React.FC<AvailabilityFilterProps> = ({
  title = "Tình trạng",
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const availability = useAppSelector((state) => state.filters.availability);

  const handleAvailabilityChange = (available: boolean) => {
    dispatch(updateAvailability(available));
  };

  return (
    <FilterGroup title={title} className={className}>
      <ToggleSwitch
        checked={availability}
        onChange={handleAvailabilityChange}
        label="Chỉ hiển thị thiết bị có sẵn"
      />
    </FilterGroup>
  );
};