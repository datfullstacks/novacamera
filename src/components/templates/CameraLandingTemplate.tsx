'use client';

import React from 'react';
import { LandingHeader, LandingFooter } from '@/components/organisms/landing';
import type { LandingNavigationItem, FooterColumn } from '@/components/organisms/landing';

export interface CameraLandingTemplateProps {
  children: React.ReactNode;
  navigationItems: LandingNavigationItem[];
  companyInfo: string;
  footerColumns: FooterColumn[];
  onLoginClick?: () => void;
  className?: string;
}

export const CameraLandingTemplate: React.FC<CameraLandingTemplateProps> = ({
  children,
  navigationItems,
  companyInfo,
  footerColumns,
  onLoginClick,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
     
      
      {/* Main content */}
      <main
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </main>
      
      {/* Footer */}
      <LandingFooter
        companyInfo={companyInfo}
        columns={footerColumns}
      />
    </div>
  );
};
