'use client';

import React from 'react';

interface SocialIconProps {
  type: 'google' | 'facebook';
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ type, className = "w-5 h-5" }) => {
  if (type === 'google') {
    return (
      <div className={`${className} overflow-hidden`}>
        <div className="w-full h-full relative overflow-hidden">
          <div className="w-2 h-2 absolute right-0 bottom-1/3 bg-blue-500" />
          <div className="w-3.5 h-2 absolute left-[1.82px] bottom-[11.75px] bg-green-600" />
          <div className="w-1 h-2 absolute left-[0.83px] bottom-[5.89px] bg-yellow-500" />
          <div className="w-3.5 h-2 absolute left-[1.82px] top-[0.83px] bg-red-500" />
        </div>
      </div>
    );
  }

  if (type === 'facebook') {
    return (
      <div className={`${className} overflow-hidden`}>
        <div className="w-full h-full bg-blue-600 rounded-sm" />
      </div>
    );
  }

  return null;
};