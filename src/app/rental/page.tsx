'use client';

import Header from '@/components/organisms/Header';
import { RentalPageTemplate } from '@/components/templates/RentalPageTemplate';
import { ProtectedRoute } from '@/components/auth';

export default function RentalPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50 pt-20">
        <Header />
        <main>
          <RentalPageTemplate />
        </main>
      </div>
    </ProtectedRoute>
  );
}