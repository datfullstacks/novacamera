'use client';

import { HTMLAttributes } from 'react';
import Text from '../../atoms/Text';
import { ViewToggle } from '../../molecules/dashboard';

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  activeView: string;
  onViewChange: (view: string) => void;
  userName: string;
  userRole: string;
  userAvatar?: string;
}

const viewOptions: { label: string; value: string }[] = [];

export default function Header({
  activeView,
  onViewChange,
  userName,
  userRole,
  userAvatar,
  className = '',
  ...props
}: HeaderProps) {
  return (
    <div
      className={`w-full min-h-16 lg:h-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {/* View Toggle */}
      <div className="flex-1 w-full lg:max-w-[500px]">
        <ViewToggle
          options={viewOptions}
          activeValue={activeView}
          onValueChange={onViewChange}
        />
      </div>

      {/* User Profile */}
      <div className="flex items-center w-full lg:w-auto justify-end">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <Text variant="body" className="text-slate-800 text-sm lg:text-base font-normal truncate">
            {userName}
          </Text>
          <Text variant="caption" className="text-slate-500 text-xs lg:text-sm truncate">
            {userRole}
          </Text>
        </div>
      </div>
    </div>
  );
}
