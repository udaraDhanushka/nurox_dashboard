'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useState, useEffect } from 'react';
import { FileText, Beaker, Clock, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';

// Mock data - replace with real API calls
const mockData = {
  pendingTests: 12,
  completedToday: 25,
  inProgress: 8,
  totalTestTypes: 45,
  recentTests: [
    { id: 1, patient: 'John Doe', test: 'Complete Blood Count', status: 'Completed' },
    { id: 2, patient: 'Jane Smith', test: 'Lipid Panel', status: 'In Progress' },
    { id: 3, patient: 'Mike Johnson', test: 'Thyroid Function', status: 'Pending' },
  ],
};

export default function LabDashboard() {
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
    <DashboardLayout role="lab">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Laboratory Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage laboratory test orders.
          </p>
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Tests"
          value={stats.pendingTests}
          icon={<Clock className="h-4 w-4" />}
          description="Tests waiting to be processed"
        />
        <StatsCard
          title="Completed Today"
          value={stats.completedToday}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Tests completed today"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Beaker className="h-4 w-4" />}
          description="Tests currently being processed"
        />
        <StatsCard
          title="Test Types"
          value={stats.totalTestTypes}
          icon={<FileText className="h-4 w-4" />}
          description="Available laboratory tests"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Tests */}
        <div className="col-span-2">
          <h3 className="text-xl font-semibold mb-4">Recent Test Orders</h3>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Test</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTests.map((test) => (
                    <tr key={test.id} className="border-t">
                      <td className="py-3">{test.patient}</td>
                      <td className="py-3">{test.test}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            test.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : test.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {test.status}
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
              Update Test Status
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
              Upload Test Results
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
              Manage Test Types
            </button>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
} 