import React from 'react';
import { landingColors, landingBorderRadius } from '@/styles/landing-theme';

export interface LandingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'dark';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export const LandingButton: React.FC<LandingButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  disabled = false,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return landingColors.primary.red;
      case 'secondary':
        return landingColors.ui.white;
      case 'dark':
        return landingColors.ui.black;
      default:
        return landingColors.primary.red;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return landingColors.ui.white;
      case 'secondary':
        return landingColors.primary.navy;
      case 'dark':
        return landingColors.text.muted;
      default:
        return landingColors.ui.white;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 42;
      case 'large':
        return 50;
      default:
        return 42;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return '0 15px';
      case 'medium':
        return '0 20px';
      case 'large':
        return '0 30px';
      default:
        return '0 20px';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        height: getHeight(),
        padding: getPadding(),
        background: getBackgroundColor(),
        color: getTextColor(),
        border: 'none',
        borderRadius: landingBorderRadius.small,
        fontSize: size === 'large' ? 20 : 16,
        fontFamily: size === 'large' ? 'Inter' : 'Poppins',
        fontWeight: size === 'large' ? 700 : 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.3s ease',
        width: fullWidth ? '100%' : 'auto',
        textAlign: 'center',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {children}
    </button>
  );
};
