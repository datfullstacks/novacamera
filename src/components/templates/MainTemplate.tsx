'use client';

import { ReactNode } from 'react';
import { Footer, Header } from '../organisms';
import Breadcrumb from '@/components/atoms/ui/Breadcrumb';

interface MainTemplateProps {
  children: ReactNode;
}

export default function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb className="text-sm" />
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
}