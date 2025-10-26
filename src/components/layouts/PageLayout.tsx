'use client';

import React from 'react';
import Header from '@/components/organisms/Header';
import { LAYOUT } from '@/lib/constants/layout';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  fullWidth?: boolean;
}

/**
 * PageLayout - Consistent layout wrapper for all pages
 * Handles header spacing and container width
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  showHeader = true,
  fullWidth = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      
      <main 
        className={cn(
          // Add padding top for fixed header
          showHeader && LAYOUT.CONTENT_PADDING_TOP,
          // Container width
          !fullWidth && 'container mx-auto px-4 sm:px-6',
          // Custom classes
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};
