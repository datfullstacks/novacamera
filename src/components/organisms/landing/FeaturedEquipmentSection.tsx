import React from 'react';
import { EquipmentCard } from '@/components/molecules/landing';
import type { EquipmentCardProps } from '@/components/molecules/landing/EquipmentCard';
import { landingColors } from '@/styles/landing-theme';

export interface FeaturedEquipmentSectionProps {
  title: string;
  equipment: Omit<EquipmentCardProps, 'className'>[];
  rentButtonText?: string;
  className?: string;
}

export const FeaturedEquipmentSection: React.FC<FeaturedEquipmentSectionProps> = ({
  title,
  equipment,
  rentButtonText,
  className = '',
}) => {
  return (
    <section
      className={className}
      style={{
        width: '100%',        
        margin: '0 auto',
        padding: '60px 0',
        background: landingColors.primary.lightGray,
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
            fontSize: 31.88,
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
      
      {/* Equipment grid */}
      <div
        style={{
          display: 'flex',
          gap: 30,
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 20px',
        }}
      >
        {equipment.map((item, index) => (
          <EquipmentCard
            key={index}
            name={item.name}
            image={item.image}
            features={item.features}
            price={item.price}
            rentButtonText={rentButtonText}
            {...(item.onRentClick && { onRentClick: item.onRentClick })}
          />
        ))}
      </div>
    </section>
  );
};
