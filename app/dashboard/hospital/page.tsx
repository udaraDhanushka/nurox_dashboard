'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Users, UserCheck, Calendar, Activity, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStaff: 0,
    pendingDoctors: 0,
    todayAppointments: 0,
    activePatients: 0,
    systemAlerts: 0,
    recentActivity: [] as { id: number; action: string; user: string; timestamp: string }[],
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch hospital stats
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalStaff: 85,
        pendingDoctors: 3,
        todayAppointments: 42,
        activePatients: 156,
        systemAlerts: 2,
        recentActivity: [
          {
            id: 1,
            action: 'New doctor verification request',
            user: 'Dr. Sarah Chen',
            timestamp: '5 minutes ago',
          },
          {
            id: 2,
            action: 'Appointment scheduled',
            user: 'Dr. Michael Thompson',
            timestamp: '15 minutes ago',
          },
          {
            id: 3,
            action: 'Staff member updated profile',
            user: 'Nurse Jessica Wilson',
            timestamp: '1 hour ago',
          },
        ],
      });
      setIsStatsLoading(false);
    };

    fetchStats();
  }, []);

  // Parent layout handles loading and authentication checks

  return (
    <DashboardLayout role="hospital">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hospital Dashboard</h1>
          <p className="text-gray-600">Manage your hospital operations and staff efficiently.</p>
        </div>

        {isStatsLoading ? (
          <div>Loading statistics...</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <StatsCard
                title="Total Staff"
                value={stats.totalStaff}
                icon={<Users className="h-4 w-4" />}
                description="All hospital staff members"
              />
              <StatsCard
                title="Pending Doctors"
                value={stats.pendingDoctors}
                icon={<UserCheck className="h-4 w-4" />}
                description="Awaiting verification"
              />
              <StatsCard
                title="Today's Appointments"
                value={stats.todayAppointments}
                icon={<Calendar className="h-4 w-4" />}
                description="Scheduled for today"
              />
              <StatsCard
                title="Active Patients"
                value={stats.activePatients}
                icon={<Activity className="h-4 w-4" />}
                description="Currently under care"
              />
              <StatsCard
                title="System Alerts"
                value={stats.systemAlerts}
                icon={<AlertTriangle className="h-4 w-4" />}
                description="Require attention"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Activity */}
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <div className="space-y-3">
                      {stats.recentActivity.map(activity => (
                        <div
                          key={activity.id}
                          className="flex items-start justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.user}</p>
                          </div>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Review Doctor Verifications</p>
                        <p className="text-sm text-gray-600">{stats.pendingDoctors} pending</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Manage Staff</p>
                        <p className="text-sm text-gray-600">View all staff members</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">View Appointments</p>
                        <p className="text-sm text-gray-600">Today&apos;s schedule</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Analytics Dashboard</p>
                        <p className="text-sm text-gray-600">View detailed reports</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
