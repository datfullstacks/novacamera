'use client';

import React from 'react';
import { Logo, LandingButton } from '@/components/atoms/landing';
import { NavMenuItem } from '@/components/molecules/landing';
import { landingColors } from '@/styles/landing-theme';

export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface LandingHeaderProps {
  navigationItems: NavigationItem[];
  onLoginClick?: () => void;
  className?: string;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  navigationItems = [],
  onLoginClick,
  className = '',
}) => {
  return (
    <header
      className={className}
      style={{
        width: '100%',
        height: 100,
        paddingLeft: 100,
        paddingRight: 100,
        background: landingColors.ui.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Logo */}
      <Logo />
      
      {/* Navigation and actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 30,
          flex: 1,
        }}
      >
        {/* Navigation items */}
        {navigationItems.map((item, index) => (
          <NavMenuItem
            key={index}
            label={item.label}
            href={item.href}
            isActive={item.isActive || false}
          />
        ))}
        
        {/* Login button */}
        {onLoginClick && (
          <LandingButton onClick={onLoginClick} variant="dark" size="small">
            Đăng nhập
          </LandingButton>
        )}
        
        {/* Cart icon */}
        <div
          style={{
            width: 40,
            height: 40,
            paddingLeft: 20,
            paddingRight: 20,
            background: landingColors.ui.black,
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                position: 'absolute',
                left: 2,
                top: 2,
                border: '2px solid white',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
