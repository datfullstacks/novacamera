import React from 'react';

export interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-transparent ${className}`}>
      <h3 className="text-sm font-extrabold text-zinc-800 leading-tight mb-4">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};