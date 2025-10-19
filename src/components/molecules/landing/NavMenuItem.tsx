'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { landingColors } from '@/styles/landing-theme';

export interface NavMenuItemProps {
  label: string;
  href: string;
  isActive: boolean;
  className?: string;
}

export const NavMenuItem: React.FC<NavMenuItemProps> = ({
  label,
  href,
  isActive,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      style={{
        color: isActive || isHovered ? landingColors.primary.navy : landingColors.text.light,
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: isActive ? 600 : 400,
        lineHeight: '16px',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </Link>
  );
};
