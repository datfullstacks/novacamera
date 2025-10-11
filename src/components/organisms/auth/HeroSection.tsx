'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/atoms/branding/Logo';
import Image from 'next/image';

interface HeroSectionProps {
  imageUrl?: string;
  imageAlt?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  imageUrl = 'https://picsum.photos/id/2/480/600',
  imageAlt = 'Professional camera equipment'
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background - Gradient fallback if image fails */}
      <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800" />
      
      {/* Background Image - Only show if not errored */}
      {!imageError && (
        <div className="w-full h-full absolute inset-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="460px"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="w-[460px] h-[600px] absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      
      {/* Logo */}
      <div className="absolute top-[30px] left-[30px]">
        <Logo variant="light" size="md" />
      </div>
    </div>
  );
};