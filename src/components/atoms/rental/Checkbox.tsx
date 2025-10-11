import React from 'react';

export interface CheckboxProps {
  id: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  onChange,
  label,
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 text-zinc-900 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      {label && (
        <label 
          htmlFor={id} 
          className="ml-2 text-sm font-normal text-zinc-800 cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
};