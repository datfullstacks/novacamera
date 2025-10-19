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
      className={`${className} group`}
      style={{
        width: 360,
        minHeight: 480,
        background: landingColors.ui.white,
        boxShadow: landingShadows.cardLarge,
        borderRadius: landingBorderRadius.medium,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = landingShadows.cardLarge;
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '100%',
          height: 220,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Image
          src={image}
          alt={name}
          fill
          unoptimized
          style={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          className="group-hover:scale-110"
        />
      </div>
      
      {/* Content */}
      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          flex: 1,
        }}
      >
        {/* Title */}
        <h3
          style={{
            color: landingColors.primary.navy,
            fontSize: 20,
            fontFamily: 'Segoe UI',
            fontWeight: 700,
            lineHeight: '28px',
            margin: 0,
            minHeight: '56px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </h3>
        
        {/* Features */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flex: 1,
            minHeight: '88px',
          }}
        >
          {features.slice(0, 4).map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: landingColors.primary.red,
                  marginTop: 8,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: landingColors.text.dark,
                  fontSize: 14,
                  fontFamily: 'Segoe UI',
                  fontWeight: 400,
                  lineHeight: '22px',
                  flex: 1,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#e5e5e5',
            margin: '8px 0',
          }}
        />
        
        {/* Price and CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                color: landingColors.text.muted,
                marginBottom: 4,
                fontFamily: 'Segoe UI',
              }}
            >
              Giá thuê từ:
            </div>
            <PriceTag amount={price} />
          </div>
          {onRentClick && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <LandingButton 
                onClick={onRentClick} 
                variant="dark" 
                size="medium"
              >
                {rentButtonText}
              </LandingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
