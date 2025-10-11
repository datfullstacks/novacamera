import React from 'react';
import { TestimonialCard } from '@/components/molecules/landing';
import type { TestimonialCardProps } from '@/components/molecules/landing';
import { landingColors } from '@/styles/landing-theme';

export interface TestimonialsSectionProps {
  title: string;
  testimonials: Omit<TestimonialCardProps, 'className'>[];
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title,
  testimonials,
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
      
      {/* Testimonials grid */}
      <div
        style={{
          display: 'flex',
          gap: 30,
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 20px',
        }}
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            authorName={testimonial.authorName}
            authorAvatar={testimonial.authorAvatar}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </section>
  );
};
