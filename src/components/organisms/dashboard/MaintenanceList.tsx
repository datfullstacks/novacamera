'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';
import { MaintenanceItem } from '../../molecules/dashboard';

interface Maintenance {
  id: string;
  equipmentName: string;
  description: string;
  priority: 'urgent' | 'scheduled';
  image?: string;
}

interface MaintenanceListProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
  maintenance: Maintenance[];
}

export default function MaintenanceList({
  title,
  actionText,
  onActionClick,
  maintenance,
  className = '',
  ...props
}: MaintenanceListProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.05)] p-4 lg:p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <Text variant="body" className="text-slate-800 text-sm lg:text-lg font-normal">
          {title}
        </Text>
        {actionText && (
          <button
            onClick={onActionClick}
            className="text-blue-500 text-xs lg:text-sm font-normal hover:text-blue-600 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
      
      <div className="space-y-0">
        {maintenance.map((item) => (
          <MaintenanceItem
            key={item.id}
            equipmentName={item.equipmentName}
            description={item.description}
            priority={item.priority}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}
