'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { rentalService } from '@/lib/api/services';

export interface RentalCalendarProps {
  equipmentId?: number;
  onDateSelect?: (dates: { start: Date | null; end: Date | null }) => void;
  className?: string;
}

export const RentalCalendar: React.FC<RentalCalendarProps> = ({
  equipmentId = 1,
  onDateSelect,
  className = '',
}) => {
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [displayMonth, setDisplayMonth] = useState<number>(0); // 0 = today's month, 1 = next month, etc

  // Calculate date range: today to 2 months from now
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  
  const twoMonthsLater = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 2);
    d.setDate(1);
    d.setDate(d.getDate() - 1);
    return d;
  }, [today]);

  // Load calendar availability from API
  useEffect(() => {
    // Reset to current month when equipment changes
    setDisplayMonth(0);
    setSelectedDates({ start: null, end: null });

    const loadAvailability = async () => {
      try {
        setLoading(true);
        
        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = twoMonthsLater.toISOString().split('T')[0];
        
        console.log(`📅 Loading calendar for equipment ${equipmentId} from ${startDateStr} to ${endDateStr}`);
        
        const response = await rentalService.getCalendarAvailability(
          equipmentId,
          startDateStr,
          endDateStr
        );

        if (response.data?.dayAvailabilities) {
          const unavailable = new Set<string>();
          response.data.dayAvailabilities.forEach((day) => {
            if (!day.isAvailable) {
              const dateStr = new Date(day.date).toISOString().split('T')[0];
              unavailable.add(dateStr);
            }
          });
          setUnavailableDates(unavailable);
          console.log(`✅ Loaded ${unavailable.size} unavailable dates`);
        }
      } catch (error) {
        console.error('❌ Error loading calendar availability:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [equipmentId, today, twoMonthsLater]);

  const handleDateClick = (date: Date) => {
    // Check if date is disabled
    if (isDateDisabled(date)) {
      return;
    }

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      const newSelection = { start: date, end: null };
      setSelectedDates(newSelection);
      onDateSelect?.(newSelection);
    } else {
      // Set end date
      const newSelection = {
        start: selectedDates.start,
        end: date > selectedDates.start ? date : selectedDates.start
      };
      setSelectedDates(newSelection);
      onDateSelect?.(newSelection);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable dates before today
    if (date < today) {
      return true;
    }

    // Disable dates after 2 months
    if (date > twoMonthsLater) {
      return true;
    }

    // Disable unavailable dates
    const dateStr = date.toISOString().split('T')[0];
    return unavailableDates.has(dateStr);
  };

  const isDateSelected = (month: number, year: number, date: number) => {
    if (!selectedDates.start) return false;

    const checkDate = new Date(year, month, date);
    checkDate.setHours(0, 0, 0, 0);

    if (selectedDates.end) {
      return checkDate >= selectedDates.start && checkDate <= selectedDates.end;
    }

    return checkDate.getTime() === selectedDates.start.getTime();
  };

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Calculate which month to display based on displayMonth offset
  const displayedDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + displayMonth);
    return d;
  }, [today, displayMonth]);

  // Check if can navigate to next month
  const canGoNext = displayMonth < 2;
  const canGoPrev = displayMonth > 0;

  const renderCalendarMonth = (month: number, year: number) => {
    const daysInCurrentMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = getFirstDayOfMonth(month, year);
    const currentMonthName = new Date(year, month, 1).toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric'
    });

    return (
      <div key={`${year}-${month}`}>
        <h4 className="text-base font-medium text-gray-700 mb-4">{currentMonthName}</h4>
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week */}
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
            <div key={day} className="text-center text-gray-600 text-xs py-2 font-medium">
              {day}
            </div>
          ))}

          {/* Calendar dates */}
          {Array.from({ length: 42 }, (_, i) => {
            const date = i - firstDayOfMonth + 1;
            const isCurrentMonth = date > 0 && date <= daysInCurrentMonth;
            
            if (!isCurrentMonth) {
              return <div key={i} className="aspect-square"></div>;
            }

            const dateObj = new Date(year, month, date);
            const isDisabled = isDateDisabled(dateObj);
            const isSelected = isDateSelected(month, year, date);

            return (
              <button
                key={`${year}-${month}-${date}`}
                onClick={() => handleDateClick(dateObj)}
                disabled={isDisabled}
                className={`
                  aspect-square rounded text-sm font-medium transition-all
                  ${isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-200'
                  }
                `}
              >
                {date}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-5 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg text-gray-800 font-normal">
          Chọn ngày cho thuê
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setDisplayMonth(prev => Math.max(0, prev - 1))}
            disabled={!canGoPrev}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Tháng trước"
          >
            ← 
          </button>
          <button
            onClick={() => setDisplayMonth(prev => Math.min(2, prev + 1))}
            disabled={!canGoNext}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Tháng sau"
          >
            →
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Đang tải lịch khả dụng...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* Display 2 months */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current month */}
            {renderCalendarMonth(displayedDate.getMonth(), displayedDate.getFullYear())}

            {/* Next month */}
            {canGoNext && (
              <div>
                {renderCalendarMonth(
                  displayedDate.getMonth() === 11 ? 0 : displayedDate.getMonth() + 1,
                  displayedDate.getMonth() === 11 ? displayedDate.getFullYear() + 1 : displayedDate.getFullYear()
                )}
              </div>
            )}
          </div>

          {/* Selected dates display */}
          {selectedDates.start && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Ngày bắt đầu:</span> {selectedDates.start.toLocaleDateString('vi-VN')}
              </p>
              {selectedDates.end && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Ngày kết thúc:</span> {selectedDates.end.toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};