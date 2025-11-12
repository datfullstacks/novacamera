'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface RentalDatePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

export const RentalDatePicker: React.FC<RentalDatePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  className = '',
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(
    startDate || new Date()
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(
    endDate || new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
  );
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate and update dropdown position
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
  };

  // Update position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [isOpen]);

  // Close dropdown when scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      // Update position instead of closing
      updateDropdownPosition();
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    setSelectedStartDate(newStartDate);
    
    // Ensure end date is after start date
    if (newStartDate >= selectedEndDate) {
      const newEndDate = new Date(newStartDate.getTime() + 24 * 60 * 60 * 1000);
      setSelectedEndDate(newEndDate);
      onDateChange(newStartDate, newEndDate);
    } else {
      onDateChange(newStartDate, selectedEndDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    if (newEndDate > selectedStartDate) {
      setSelectedEndDate(newEndDate);
      onDateChange(selectedStartDate, newEndDate);
    }
  };

  const getDaysDifference = () => {
    const diffTime = selectedEndDate.getTime() - selectedStartDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMinStartDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinEndDate = () => {
    const nextDay = new Date(selectedStartDate.getTime() + 24 * 60 * 60 * 1000);
    return nextDay.toISOString().split('T')[0];
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-200 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {formatDate(selectedStartDate)} - {formatDate(selectedEndDate)}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          ({getDaysDifference()} ngày)
        </span>
      </button>

      {/* Date Picker Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel - positioned next to button */}
          <div 
            ref={dropdownRef}
            className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 p-4 w-96"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="space-y-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ngày bắt đầu thuê
                </label>
                <input
                  type="date"
                  value={selectedStartDate.toISOString().split('T')[0]}
                  onChange={handleStartDateChange}
                  min={getMinStartDate()}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ngày trả thiết bị
                </label>
                <input
                  type="date"
                  value={selectedEndDate.toISOString().split('T')[0]}
                  onChange={handleEndDateChange}
                  min={getMinEndDate()}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                />
              </div>

              {/* Summary */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 font-medium">Thời gian thuê:</span>
                  <span className="font-bold text-gray-900">
                    {getDaysDifference()} ngày
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};