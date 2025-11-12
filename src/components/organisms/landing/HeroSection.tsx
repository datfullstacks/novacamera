"use client";

import Image from "next/image";
import Link from "next/link";

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  backgroundImage: string;
}

export function HeroSection({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px] py-12 lg:py-20">
          {/* Left Column - Image */}
          <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={backgroundImage}
              alt="Professional Camera Equipment"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Right Column - Text Content */}
          <div className="space-y-6 lg:space-y-8 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xl">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/equipment/public"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {ctaPrimaryText}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-lg transition-all"
              >
                {ctaSecondaryText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </section>
  );
}
