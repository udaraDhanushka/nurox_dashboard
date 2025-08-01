'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TestTube, ClipboardList, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MLTDashboard() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState({
    pendingTests: 0,
    completedToday: 0,
    abnormalResults: 0,
    urgentTests: 0,
    totalTests: 0,
    recentActivity: [] as {
      id: number;
      action: string;
      patient?: string;
      test: string;
      timestamp: string;
    }[],
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch MLT stats
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        pendingTests: 12,
        completedToday: 28,
        abnormalResults: 3,
        urgentTests: 2,
        totalTests: 156,
        recentActivity: [
          {
            id: 1,
            action: 'Blood test completed',
            patient: 'Alice Wilson',
            test: 'Complete Blood Count',
            timestamp: '10 minutes ago',
          },
          {
            id: 2,
            action: 'Urgent test flagged',
            patient: 'John Smith',
            test: 'Cardiac Markers',
            timestamp: '25 minutes ago',
          },
          {
            id: 3,
            action: 'Quality control passed',
            test: 'Chemistry Panel',
            timestamp: '1 hour ago',
          },
        ],
      });
      setIsStatsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'MLT') {
    return <div>Access denied</div>;
  }

  return (
    <DashboardLayout role="MLT">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lab Technician Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName}! Here&apos;s your laboratory workload overview.
          </p>
        </div>

        {isStatsLoading ? (
          <div>Loading laboratory data...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <StatsCard
                title="Pending Tests"
                value={stats.pendingTests}
                icon={<Clock className="h-4 w-4" />}
                description="Awaiting processing"
              />
              <StatsCard
                title="Completed Today"
                value={stats.completedToday}
                icon={<CheckCircle className="h-4 w-4" />}
                description="Tests finished"
              />
              <StatsCard
                title="Abnormal Results"
                value={stats.abnormalResults}
                icon={<AlertCircle className="h-4 w-4" />}
                description="Require review"
              />
              <StatsCard
                title="Urgent Tests"
                value={stats.urgentTests}
                icon={<TestTube className="h-4 w-4" />}
                description="High priority"
              />
              <StatsCard
                title="Total This Week"
                value={stats.totalTests}
                icon={<Activity className="h-4 w-4" />}
                description="Tests processed"
              />
              <StatsCard
                title="Quality Score"
                value="98.5%"
                icon={<ClipboardList className="h-4 w-4" />}
                description="This month"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                            <p className="text-sm text-gray-600">
                              {activity.patient && `Patient: ${activity.patient} - `}
                              {activity.test}
                            </p>
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
                      <TestTube className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Process Urgent Tests</p>
                        <p className="text-sm text-gray-600">{stats.urgentTests} high priority</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">View Test Orders</p>
                        <p className="text-sm text-gray-600">{stats.pendingTests} pending</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Review Abnormal Results</p>
                        <p className="text-sm text-gray-600">
                          {stats.abnormalResults} need attention
                        </p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Quality Control</p>
                        <p className="text-sm text-gray-600">Run daily checks</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Lab Equipment Status */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Equipment Status</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Hematology Analyzer</h4>
                      <p className="text-sm text-gray-600">Last calibration: 2 days ago</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Chemistry Analyzer</h4>
                      <p className="text-sm text-gray-600">Last calibration: 1 day ago</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Microscope Station</h4>
                      <p className="text-sm text-gray-600">Maintenance due in 5 days</p>
                    </div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
