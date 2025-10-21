'use client';

import { ReactNode } from 'react';
import { Footer, Header } from '../organisms';

interface MainTemplateProps {
  children: ReactNode;
}

export default function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}