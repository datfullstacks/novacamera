import React from 'react';
import { landingColors } from '@/styles/landing-theme';

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface RatingStarsProps {
  rating: RatingValue;
  size?: number;
  color?: string;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 13.85,
  color = landingColors.ui.yellow,
  className = '',
}) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < rating ? '★' : '☆';
  });

  return (
    <span
      className={className}
      style={{
        color,
        fontSize: size,
        fontFamily: 'Segoe UI',
        fontWeight: 400,
        lineHeight: '25px',
      }}
    >
      {stars.join('')}
    </span>
  );
};
