import React from 'react';
import Image from 'next/image';
import { landingColors, landingShadows, landingBorderRadius } from '@/styles/landing-theme';

export interface CategoryCardProps {
  name: string;
  subtitle: string;
  image: string;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  subtitle,
  image,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        width: 212,
        height: 241,
        background: landingColors.primary.lightGray,
        boxShadow: landingShadows.card,
        borderRadius: landingBorderRadius.medium,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {/* Image */}
      <div
        style={{
          width: 212,
          height: 150,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={image}
          alt={name}
          fill
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      
      {/* Content */}
      <div
        style={{
          width: '100%',
          height: 91,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: landingColors.primary.navy,
            fontSize: 18.48,
            fontFamily: 'Segoe UI',
            fontWeight: 700,
            lineHeight: '29px',
          }}
        >
          {name}
        </div>
        <div
          style={{
            textAlign: 'center',
            color: landingColors.text.dark,
            fontSize: 15.97,
            fontFamily: 'Segoe UI',
            fontWeight: 400,
            lineHeight: '25px',
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};
