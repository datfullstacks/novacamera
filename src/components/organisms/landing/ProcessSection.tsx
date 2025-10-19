import React from 'react';
import { ProcessStep } from '@/components/molecules/landing';
import type { ProcessStepProps } from '@/components/molecules/landing';
import { landingColors } from '@/styles/landing-theme';

export interface ProcessSectionProps {
  title: string;
  steps: Omit<ProcessStepProps, 'className'>[];
  className?: string;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  title,
  steps,
  className = '',
}) => {
  return (
    <section
      className={className}
      style={{
        width: '100%',
        maxWidth: 1181,
        margin: '0 auto',
        padding: '60px 0',
      }}
    >
      {/* Section title with underline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: landingColors.primary.navy,
            fontSize: 31.92,
            fontFamily: 'Segoe UI',
            fontWeight: 700,
            lineHeight: '51px',
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: 80,
            height: 3,
            background: landingColors.primary.red,
            marginTop: 10,
          }}
        />
      </div>
      
      {/* Steps grid */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          flexWrap: 'nowrap',
          padding: '0 20px',
        }}
      >
        {steps.map((step, index) => (
          <ProcessStep
            key={index}
            number={step.number}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  );
};
