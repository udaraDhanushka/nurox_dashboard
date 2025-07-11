'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the login form as a client component with no SSR
const LoginForm = dynamic(() => import('@/components/auth/login-form'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md text-center">Loading...</div>
    </div>
  ),
});

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}