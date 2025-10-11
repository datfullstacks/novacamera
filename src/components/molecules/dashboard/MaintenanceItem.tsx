'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';
import { Badge } from '../../atoms/dashboard';

interface MaintenanceItemProps extends HTMLAttributes<HTMLDivElement> {
  equipmentName: string;
  description: string;
  priority: 'urgent' | 'scheduled';
  image?: string;
}

export default function MaintenanceItem({
  equipmentName,
  description,
  priority,
  image,
  className = '',
  ...props
}: MaintenanceItemProps) {
  const priorityLabels = {
    urgent: 'Cấp bách',
    scheduled: 'Dự kiến',
  };

  return (
    <div
      className={`flex items-start py-3 lg:py-4 border-b border-slate-200 last:border-b-0 ${className}`}
      {...props}
    >
      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden mr-3 lg:mr-4 flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={equipmentName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">IMG</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <Text variant="body" className="text-slate-800 text-xs lg:text-sm font-normal mb-2 truncate">
          {equipmentName}
        </Text>
        <Text variant="caption" className="text-slate-500 text-xs lg:text-sm line-clamp-2">
          {description}
        </Text>
      </div>
      
      <Badge variant={priority} className="ml-2 lg:ml-4 flex-shrink-0">
        {priorityLabels[priority]}
      </Badge>
    </div>
  );
}
