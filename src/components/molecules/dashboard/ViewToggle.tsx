'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';

interface ViewToggleProps extends HTMLAttributes<HTMLDivElement> {
  readonly options: ReadonlyArray<{
    readonly label: string;
    readonly value: string;
  }>;
  readonly activeValue: string;
  readonly onValueChange: (value: string) => void;
}

export default function ViewToggle({
  options,
  activeValue,
  onValueChange,
  className = '',
  ...props
}: ViewToggleProps) {
  return (
    <div className={`rounded-lg p-1 flex flex-wrap ${className}`} {...props}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={`px-2 lg:px-4 py-2 rounded-md transition-colors flex-1 min-w-0 ${
            activeValue === option.value
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Text variant="body" className="text-xs lg:text-base font-normal text-center truncate">
            {option.label}
          </Text>
        </button>
      ))}
    </div>
  );
}
