import React from 'react';

export interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  label,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        className={`
          relative inline-flex h-6 w-12 rounded-3xl
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${checked ? 'bg-zinc-900' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white 
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-7' : 'translate-x-1'}
            mt-1
          `}
        />
      </button>
      {label && (
        <span className="text-base font-normal text-zinc-800">
          {label}
        </span>
      )}
    </div>
  );
};