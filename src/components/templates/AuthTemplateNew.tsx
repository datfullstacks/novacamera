'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthTemplateProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  heroImageUrl = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=800&fit=crop",
  heroImageAlt = "Nova Camera Equipment"
}) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-black">
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          {/* Logo */}
          <div className="absolute top-8 left-8 z-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">N</span>
              </div>
              <span className="text-white text-xl font-semibold">Nova Camera</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md h-full flex flex-col justify-center">
            {/* Back Button */}
            <div className="mb-4 flex justify-end">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại trang chủ
              </Link>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <Link href="/" className="inline-flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Nova Camera</span>
              </Link>
            </div>

            {/* Auth Form */}
            <div className="flex flex-col justify-center">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
                <p className="text-gray-600 text-sm">{subtitle}</p>
              </div>

              {children}

              {/* Footer */}
              <div className="text-center mt-4 pt-3 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  {footerText}{' '}
                  <Link 
                    href={footerLinkHref}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {footerLinkText}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
