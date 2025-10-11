import React from 'react';
import { landingColors, landingBorderRadius, landingSizes } from '@/styles/landing-theme';

export interface StepNumberProps {
  number: number;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

export const StepNumber: React.FC<StepNumberProps> = ({
  number,
  size = landingSizes.processStep.iconSize,
  backgroundColor = landingColors.primary.mint,
  textColor = landingColors.primary.navy,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: backgroundColor,
        borderRadius: landingBorderRadius.circle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: textColor,
          fontSize: 30,
          fontFamily: 'Segoe UI',
          fontWeight: 700,
          lineHeight: '48px',
        }}
      >
        {number}
      </span>
    </div>
  );
};
