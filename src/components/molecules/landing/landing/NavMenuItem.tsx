import React from 'react';
import Link from 'next/link';
import { landingColors } from '@/styles/landing-theme';

export interface NavMenuItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  className?: string;
}

export const NavMenuItem: React.FC<NavMenuItemProps> = ({
  label,
  href,
  isActive = false,
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={className}
      style={{
        color: isActive ? landingColors.primary.navy : landingColors.text.light,
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: 400,
        lineHeight: '16px',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = landingColors.primary.navy;
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = landingColors.text.light;
        }
      }}
    >
      {label}
    </Link>
  );
};
