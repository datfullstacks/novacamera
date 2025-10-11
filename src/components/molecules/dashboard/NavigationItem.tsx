'use client';

import { ReactNode, HTMLAttributes } from 'react';
import Text from '../../atoms/Text';

interface NavigationItemProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function NavigationItem({
  icon,
  label,
  active = false,
  onClick,
  className = '',
  ...props
}: NavigationItemProps) {
  const baseStyles = 'w-48 h-11 rounded-lg flex items-center px-3 cursor-pointer transition-colors';
  const activeStyles = active 
    ? 'bg-blue-500 text-white' 
    : 'text-slate-400 hover:bg-slate-700 hover:text-white';

  return (
    <div
      className={`${baseStyles} ${activeStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="w-4 h-4 mr-3 flex items-center justify-center">
        {icon}
      </div>
      <Text variant="body" className="text-base font-normal">
        {label}
      </Text>
    </div>
  );
}
