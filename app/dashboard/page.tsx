'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');

    if (!userData) {
      // If no user data is found, redirect to login
      router.replace('/login');
      return;
    }

    try {
      const { role } = JSON.parse(userData);
      // Redirect to the role-specific dashboard
      router.replace(`/dashboard/${role}`);
    } catch (error) {
      // If there's an error parsing the user data, redirect to login
      router.replace('/login');
    }
  }, [router]);

  // Return null since this is just a redirect page
  return null;
}
