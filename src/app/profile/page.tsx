'use client';

import { ProtectedRoute } from '@/components/auth';
import ProfilePage from '@/components/pages/ProfilePage';

export default function ProfileRoutePage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}