'use client';

import Header from '@/components/organisms/Header';
import { RentalPageTemplate } from '@/components/templates/RentalPageTemplate';

export default function RentalPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="pt-20">
        <RentalPageTemplate />
      </main>
    </div>
  );
}