import React from 'react';
import { Avatar, RatingStars } from '@/components/atoms/landing';
import type { RatingValue } from '@/components/atoms/landing';
import { landingColors, landingShadows, landingBorderRadius } from '@/styles/landing-theme';

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorAvatar: string;
  rating: RatingValue;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorAvatar,
  rating,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        width: 360,
        height: 230,
        padding: 25,
        background: landingColors.ui.white,
        boxShadow: landingShadows.card,
        borderRadius: landingBorderRadius.medium,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* Quote mark */}
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: 5,
          color: landingColors.ui.lightGray,
          fontSize: 23.3,
          fontFamily: 'Segoe UI',
          fontWeight: 400,
          lineHeight: '96px',
        }}
      >
        &ldquo;
      </div>
      
      {/* Quote text */}
      <div
        style={{
          color: landingColors.text.dark,
          fontSize: 15.48,
          fontFamily: 'Segoe UI',
          fontWeight: 400,
          lineHeight: '25px',
          flex: 1,
        }}
      >
        {quote}
      </div>
      
      {/* Author info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          marginTop: 20,
        }}
      >
        <Avatar src={authorAvatar} alt={authorName} size={50} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: landingColors.text.dark,
              fontSize: 15.97,
              fontFamily: 'Segoe UI',
              fontWeight: 700,
              lineHeight: '25px',
            }}
          >
            {authorName}
          </div>
          <RatingStars rating={rating} />
        </div>
      </div>
    </div>
  );
};
