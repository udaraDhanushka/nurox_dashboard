'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import SuperAdminDashboard from '@/components/dashboard/super-admin/super-admin-dashboard';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Users, Activity, Bell, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Parent layout handles loading and authentication checks
  // We can safely assume user exists here and is authenticated

  return (
    <DashboardLayout role="admin">
      {user?.role === 'SUPER_ADMIN' ? <SuperAdminDashboard /> : <LegacyAdminDashboard />}
    </DashboardLayout>
  );
}

// Legacy admin dashboard for backward compatibility
const LegacyAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    securityAlerts: 0,
    recentActivity: [] as {
      id: number;
      user: string;
      action: string;
      type: string;
      timestamp: string;
    }[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = {
        totalUsers: 1850,
        activeUsers: 1245,
        pendingApprovals: 15,
        securityAlerts: 3,
        recentActivity: [
          {
            id: 1,
            user: 'Dr. Sarah Chen',
            action: 'Account Created',
            type: 'doctor',
            timestamp: '2 minutes ago',
          },
          {
            id: 2,
            user: 'Lab Tech',
            action: 'Password Reset',
            type: 'lab',
            timestamp: '15 minutes ago',
          },
          {
            id: 3,
            user: 'Pharmacy Staff',
            action: 'Profile Updated',
            type: 'pharmacist',
            timestamp: '1 hour ago',
          },
        ],
      };
      setStats(mockData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          System-wide monitoring and management for all healthcare services.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-4 w-4" />}
          description="Registered users across all roles"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Activity className="h-4 w-4" />}
          description="Currently active users"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<Bell className="h-4 w-4" />}
          description="Users awaiting approval"
        />
        <StatsCard
          title="Security Alerts"
          value={stats.securityAlerts}
          icon={<Shield className="h-4 w-4" />}
          description="Active security alerts"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="col-span-2">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Recent Activity</h3>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Action</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivity.map(activity => (
                    <tr key={activity.id} className="border-t">
                      <td className="py-3">{activity.user}</td>
                      <td className="py-3">{activity.action}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.type === 'doctor'
                              ? 'bg-blue-100 text-blue-800'
                              : activity.type === 'lab'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {activity.type}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-500">{activity.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-white p-4 rounded-lg shadow-sm border text-left hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700">
              Approve New Users
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow-sm border text-left hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700">
              System Backup
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow-sm border text-left hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700">
              Security Settings
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow-sm border text-left hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700">
              View Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
