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
        maxWidth: 1440,
        margin: '0 auto',
        padding: '60px 20px',
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
            fontFamily: 'var(--font-geist-sans), sans-serif',
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
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          maxWidth: '100%',
        }}
        className="lg:grid-cols-5"
      >
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            id={category.id}
            name={category.name}
            description={category.description}
            imageUrl={category.imageUrl}
            itemCount={category.itemCount}
            href={category.href}
          />
        ))}
      </div>
    </section>
  );
};
