'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  heroSection?: React.ReactNode;
  quote?: string;
  quoteAuthor?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  heroSection,
  quote = "Thuê thiết bị. Nắm bắt khoảnh khắc.",
  quoteAuthor = "Được tin tưởng bởi hàng ngàn người tạo."
}) => {
  return (
    <div className="w-full h-screen relative bg-gray-100 overflow-hidden">
      <div className="w-full h-full flex">
        {/* Hero Section - Left Side */}
        <div className="w-[558px] h-full relative bg-black/0 flex-shrink-0">
          {heroSection}
          
          {/* Quote Section */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-black/0 z-10">
            <div className="px-8 py-8">
              <div className="text-white text-2xl font-bold font-['Inter'] leading-loose mb-2">
                &ldquo;{quote}&rdquo;
              </div>
              <div className="text-white/80 text-xs font-normal font-['Inter'] leading-tight">
                {quoteAuthor}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section - Right Side */}
        <div className="flex-1 h-full bg-white overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-96 max-w-md px-6 py-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};