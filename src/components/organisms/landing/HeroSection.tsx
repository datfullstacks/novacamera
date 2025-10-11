'use client';

import React from 'react';
import Image from 'next/image';
import { LandingButton } from '@/components/atoms/landing';
import { landingColors } from '@/styles/landing-theme';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  backgroundImage: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  backgroundImage,
  onPrimaryClick,
  onSecondaryClick,
  className = '',
}) => {
  return (
    <section
      className={className}
      style={{
        width: '100%',
        height: 500,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt="Hero background"
        fill
        style={{
          objectFit: 'cover',
        }}
        priority
      />
      
      {/* Content overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.3)', // Dark overlay for better text visibility
        }}
      >
        <div
          style={{
            width: 771,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {/* Title */}
          <h1
            style={{
              textAlign: 'center',
              color: landingColors.ui.white,
              fontSize: 40,
              fontFamily: 'Inter',
              fontWeight: 700,
              lineHeight: '76px',
              margin: 0,
            }}
          >
            {title}
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              textAlign: 'center',
              color: landingColors.ui.white,
              fontSize: 17.88,
              fontFamily: 'Inter',
              fontWeight: 400,
              lineHeight: '28px',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
          
          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: 30,
              marginTop: 20,
            }}
          >
            {onPrimaryClick && (
              <LandingButton onClick={onPrimaryClick} variant="primary" size="large">
                {ctaPrimaryText}
              </LandingButton>
            )}
            {onSecondaryClick && (
              <LandingButton onClick={onSecondaryClick} variant="primary" size="large">
                {ctaSecondaryText}
              </LandingButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
