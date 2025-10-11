'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/atoms/branding/Logo';
import Image from 'next/image';

interface AuthHeroSectionProps {
  imageUrl?: string;
  imageAlt?: string;
}

export const AuthHeroSection: React.FC<AuthHeroSectionProps> = ({
  imageUrl = 'https://picsum.photos/id/3/558/1091',
  imageAlt = 'Professional camera equipment'
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-[558px] h-full relative overflow-hidden">
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
            sizes="558px"
            priority
            onError={() => setImageError(true)}
          />
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="w-full h-full absolute inset-0 bg-gradient-to-l from-black/70 to-black/20" />
      
      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo variant="light" size="md" />
      </div>
    </div>
  );
};