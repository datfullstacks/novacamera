import React from 'react';
import { CategoryCard } from '@/components/molecules/landing';
import type { CategoryCardProps } from '@/components/molecules/landing';
import { landingColors } from '@/styles/landing-theme';

export interface CategoriesSectionProps {
  title: string;
  categories: Omit<CategoryCardProps, 'className'>[];
  className?: string;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  title,
  categories,
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
            fontSize: 31.97,
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
      
      {/* Categories grid */}
      <div
        style={{
          display: 'flex',
          gap: 30,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            name={category.name}
            subtitle={category.subtitle}
            image={category.image}
            {...(category.onClick && { onClick: category.onClick })}
          />
        ))}
      </div>
    </section>
  );
};
