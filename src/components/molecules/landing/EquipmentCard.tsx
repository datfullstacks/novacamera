'use client';

import React from 'react';
import Image from 'next/image';
import { PriceTag, LandingButton } from '@/components/atoms/landing';
import { landingColors, landingShadows, landingBorderRadius } from '@/styles/landing-theme';

export interface EquipmentCardProps {
  name: string;
  image: string;
  features: string[];
  price: string;
  rentButtonText?: string;
  onRentClick?: () => void;
  className?: string;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  name,
  image,
  features,
  price,
  rentButtonText = 'Rent Now',
  onRentClick,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        width: 360,
        height: 414,
        background: landingColors.ui.white,
        boxShadow: landingShadows.cardLarge,
        borderRadius: landingBorderRadius.medium,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: 360,
          height: 200,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={image}
          alt={name}
          fill
          unoptimized
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      
      {/* Content */}
      <div
        style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
        }}
      >
        {/* Title */}
        <h3
          style={{
            color: landingColors.primary.navy,
            fontSize: 18.68,
            fontFamily: 'Segoe UI',
            fontWeight: 700,
            lineHeight: '29px',
            margin: 0,
          }}
        >
          {name}
        </h3>
        
        {/* Features */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            flex: 1,
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                color: landingColors.text.dark,
                fontSize: 13.98,
                fontFamily: 'Segoe UI',
                fontWeight: 400,
                lineHeight: '22px',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
        
        {/* Price and CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <PriceTag amount={price} />
          {onRentClick && (
            <LandingButton onClick={onRentClick} variant="dark" size="medium">
              {rentButtonText}
            </LandingButton>
          )}
        </div>
      </div>
    </div>
  );
};
