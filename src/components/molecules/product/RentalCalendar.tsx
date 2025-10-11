'use client';

import React, { useState } from 'react';
import { CalendarDay } from '../../atoms/product';

export interface RentalCalendarProps {
  unavailableDates?: number[];
  onDateSelect?: (dates: { start: Date | null; end: Date | null }) => void;
  className?: string;
}

export const RentalCalendar: React.FC<RentalCalendarProps> = ({
  unavailableDates = [13, 14, 15],
  onDateSelect,
  className = '',
}) => {
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const handleDateClick = (date: number) => {
    const clickedDate = new Date(currentYear, currentMonth - 1, date);
    
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      const newSelection = { start: clickedDate, end: null };
      setSelectedDates(newSelection);
      onDateSelect?.(newSelection);
    } else {
      // Set end date
      const newSelection = { 
        start: selectedDates.start, 
        end: clickedDate > selectedDates.start ? clickedDate : selectedDates.start 
      };
      setSelectedDates(newSelection);
      onDateSelect?.(newSelection);
    }
  };

  const isDateSelected = (date: number) => {
    if (!selectedDates.start) return false;
    
    const checkDate = new Date(currentYear, currentMonth - 1, date);
    
    if (selectedDates.end) {
      return checkDate >= selectedDates.start && checkDate <= selectedDates.end;
    }
    
    return checkDate.getTime() === selectedDates.start.getTime();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-5 ${className}`}>
      <h3 className="text-lg text-gray-800 font-normal mb-4">
        Chọn ngày cho thuê
        <span className="float-right text-base text-gray-800">
          Tháng {currentMonth} năm {currentYear}
        </span>
      </h3>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Days of week */}
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <div key={day} className="text-center text-gray-600 text-base py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar dates */}
        {Array.from({ length: 35 }, (_, i) => {
          const date = i - 3; // Start from 28th of previous month
          const isCurrentMonth = date > 0 && date <= 30;
          const isUnavailable = unavailableDates.includes(date);
          const isSelected = isDateSelected(date);
          
          return (
            <CalendarDay
              key={i}
              date={date > 0 ? date : date + 31}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              isUnavailable={isUnavailable}
              onClick={() => isCurrentMonth && !isUnavailable && handleDateClick(date)}
            />
          );
        })}
      </div>
    </div>
  );
};