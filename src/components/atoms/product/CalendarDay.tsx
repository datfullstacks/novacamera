'use client';

import React from 'react';

export interface CalendarDayProps {
  date: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isUnavailable: boolean;
  onClick?: () => void;
  className?: string;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  isSelected,
  isUnavailable,
  onClick,
  className = '',
}) => {
  const getClasses = () => {
    let classes = 'h-11 rounded flex items-center justify-center text-base cursor-pointer ';
    
    if (!isCurrentMonth) {
      classes += 'text-gray-400 ';
    } else if (isSelected) {
      classes += 'bg-gray-900 text-white ';
    } else if (isUnavailable) {
      classes += 'text-gray-400 line-through cursor-not-allowed ';
    } else {
      classes += 'text-gray-800 hover:bg-gray-100 ';
    }
    
    return classes + className;
  };

  return (
    <button
      onClick={onClick}
      disabled={!isCurrentMonth || isUnavailable}
      className={getClasses()}
    >
      {date}
    </button>
  );
};