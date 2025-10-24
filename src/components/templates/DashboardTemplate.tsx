'use client';

import { ReactNode, HTMLAttributes } from 'react';
import Text from '../atoms/Text';
import { Sidebar, Header } from '../organisms/dashboard';
import ChatProvider from '../layout/ChatProvider';
import Breadcrumb from '@/components/atoms/ui/Breadcrumb';

interface DashboardTemplateProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly activeSidebarItem?: string;
  readonly onSidebarItemClick?: (item: string) => void;
  readonly activeView: string;
  readonly onViewChange: (view: string) => void;
  readonly userName: string;
  readonly userRole: string;
  readonly userAvatar?: string;
}

export default function DashboardTemplate({
  children,
  activeSidebarItem = 'dashboard',
  onSidebarItemClick,
  activeView,
  onViewChange,
  userName,
  userRole,
  userAvatar,
  className = '',
  ...props
}: DashboardTemplateProps) {
  return (
    <ChatProvider>
      <div
        className={`min-h-screen bg-neutral-50 flex flex-col lg:flex-row ${className}`}
        {...props}
      >
        {/* Sidebar */}
        <Sidebar
          activeItem={activeSidebarItem}
          onItemClick={onSidebarItemClick}
          className="w-full lg:w-60 h-auto lg:h-screen lg:fixed lg:left-0 lg:top-0 z-10"
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-60 min-h-screen">
          {/* Header */}
          <div className="w-full px-4 lg:px-8 py-4 lg:py-6">
            <Header
              activeView={activeView}
              onViewChange={onViewChange}
              userName={userName}
              userRole={userRole}
              userAvatar={userAvatar}
              className="w-full"
            />
          </div>

          {/* Page Title */}
          <div className="px-4 lg:px-8 mb-6">
            <div className="mb-4">
              <Breadcrumb className="text-sm" />
            </div>
            <Text variant="body" className="text-slate-800 text-xl lg:text-2xl font-normal leading-loose">
              Bảng điều khiển nền tảng
            </Text>
          </div>

          {/* Main Content */}
          <div className="px-4 lg:px-8 pb-8">
            {children}
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}

