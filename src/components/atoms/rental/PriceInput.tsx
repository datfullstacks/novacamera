import React from 'react';

export interface PriceInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value = '',
  onChange,
  placeholder = '0',
  className = '',
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`
        w-full h-9 px-3 py-2
        bg-white rounded 
        border border-gray-200 
        text-black text-xs font-normal
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${className}
      `}
    />
  );
};