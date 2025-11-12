'use client';

import React from 'react';
import PageFooter from '@/components/molecules/common/PageFooter';

export interface CameraLandingTemplateProps {
  children: React.ReactNode;
  companyInfo?: string;
  onLoginClick?: () => void;
  className?: string;
}

export const CameraLandingTemplate: React.FC<CameraLandingTemplateProps> = ({
  children,
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
      <PageFooter />
    </div>
  );
};
