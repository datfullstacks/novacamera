import React from 'react';
import { StepNumber } from '@/components/atoms/landing';
import { landingColors } from '@/styles/landing-theme';

export interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  description,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        width: 265,
        height: 257,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {/* Step number */}
      <StepNumber number={number} />
      
      {/* Title */}
      <h3
        style={{
          textAlign: 'center',
          color: landingColors.primary.navy,
          fontSize: 18.57,
          fontFamily: 'Segoe UI',
          fontWeight: 700,
          lineHeight: '29px',
          margin: 0,
          width: 225,
        }}
      >
        {title}
      </h3>
      
      {/* Description */}
      <p
        style={{
          textAlign: 'center',
          color: landingColors.text.dark,
          fontSize: 15.73,
          fontFamily: 'Segoe UI',
          fontWeight: 400,
          lineHeight: '25px',
          margin: 0,
          width: 225,
        }}
      >
        {description}
      </p>
    </div>
  );
};
