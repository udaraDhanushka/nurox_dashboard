'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';

// Import the login form as a client component with no SSR
const LoginForm = dynamic(() => import('@/components/auth/login-form'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  ),
});

export default function LoginPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const getRoleDashboardPath = (role: string) => {
        switch (role) {
          case 'SUPER_ADMIN': return '/dashboard/admin';
          case 'HOSPITAL_ADMIN': return '/dashboard/hospital';
          case 'PHARMACY_ADMIN': return '/dashboard/pharmacy';
          case 'LAB_ADMIN': return '/dashboard/lab';
          case 'INSURANCE_ADMIN': return '/dashboard/insurer';
          case 'DOCTOR': return '/dashboard/doctor';
          case 'PHARMACIST': return '/dashboard/pharmacist';
          case 'MLT': return '/dashboard/mlt';
          default: return '/dashboard';
        }
      };
      
      const dashboardPath = getRoleDashboardPath(user.role);
      router.push(dashboardPath);
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}