'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, Users, Clock } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';

// Mock data - replace with real API calls
const mockData = {
  pendingClaims: 18,
  processedToday: 32,
  totalPatients: 1250,
  totalAmount: 45600,
  recentClaims: [
    { id: 1, patient: 'John Doe', amount: 1200, status: 'Approved' },
    { id: 2, patient: 'Jane Smith', amount: 850, status: 'Pending' },
    { id: 3, patient: 'Mike Johnson', amount: 2100, status: 'Under Review' },
  ],
};

export default function InsurerDashboard() {
  const [stats, setStats] = useState(mockData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Insurance Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and process insurance claims.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Claims"
          value={stats.pendingClaims}
          icon={<Clock className="h-4 w-4" />}
          description="Claims awaiting review"
        />
        <StatsCard
          title="Processed Today"
          value={stats.processedToday}
          icon={<FileText className="h-4 w-4" />}
          description="Claims processed today"
        />
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users className="h-4 w-4" />}
          description="Registered patients"
        />
        <StatsCard
          title="Total Amount"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          description="Claims processed this month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Claims */}
        <div className="col-span-2">
          <h3 className="text-xl font-semibold mb-4">Recent Claims</h3>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentClaims.map((claim) => (
                    <tr key={claim.id} className="border-t">
                      <td className="py-3">{claim.patient}</td>
                      <td className="py-3">${claim.amount.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            claim.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : claim.status === 'Under Review'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
              Review Pending Claims
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
              Generate Reports
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
              View Patient History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 