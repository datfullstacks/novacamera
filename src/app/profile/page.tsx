'use client';

import { ProtectedRoute } from '@/components/auth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState } from 'react';


import ProfilePage from '@/components/pages/ProfilePage';

export default function ProfileRoutePage() {
  return <ProfilePage />;
}