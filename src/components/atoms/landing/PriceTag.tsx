import React from 'react';
import { landingColors, landingTypography } from '@/styles/landing-theme';

export interface PriceTagProps {
  amount: string;
  period?: string;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  period = '/ngày',
  fontSize = landingTypography.fontSizes.price,
  fontWeight = landingTypography.fontWeights.bold,
  color = landingColors.primary.red,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        color,
        fontSize,
        fontFamily: landingTypography.fontFamilies.primary,
        fontWeight,
        lineHeight: '32px',
      }}
    >
      {amount}{period}
    </div>
  );
};
