'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, AlertTriangle } from 'lucide-react';

export default function InsuranceAgentAccessDenied() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after showing message
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertTriangle className="h-16 w-16 text-red-500" />
              <Smartphone className="h-8 w-8 text-blue-500 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            Insurance Agents should use the <strong>Nurox Mobile App</strong> to manage clients,
            process claims, and handle policies on the go.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Download the Nurox Mobile App from:</p>
            <div className="flex justify-center space-x-4">
              <div className="bg-gray-100 px-3 py-2 rounded text-sm">📱 App Store</div>
              <div className="bg-gray-100 px-3 py-2 rounded text-sm">🤖 Google Play</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">Redirecting to login in 5 seconds...</p>
        </div>
      </div>
    </div>
  );
}
