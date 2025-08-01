'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Beaker } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock data - replace with real API calls
const mockData = {
  todayAppointments: 8,
  totalPatients: 245,
  pendingPrescriptions: 12,
  pendingLabResults: 5,
  recentAppointments: [
    { id: 1, patient: 'John Doe', time: '09:00 AM', status: 'Completed' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', status: 'Upcoming' },
    { id: 3, patient: 'Mike Johnson', time: '02:00 PM', status: 'Upcoming' },
  ],
};

export default function DoctorDashboard() {
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
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your practice today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={<Calendar className="h-4 w-4" />}
            description="Appointments scheduled for today"
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<Users className="h-4 w-4" />}
            description="Registered patients under your care"
          />
          <StatsCard
            title="Pending Prescriptions"
            value={stats.pendingPrescriptions}
            icon={<FileText className="h-4 w-4" />}
            description="Prescriptions waiting to be filled"
          />
          <StatsCard
            title="Pending Lab Results"
            value={stats.pendingLabResults}
            icon={<Beaker className="h-4 w-4" />}
            description="Test results awaiting review"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Appointments */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">Recent Appointments</h3>
            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAppointments.map(appointment => (
                      <tr key={appointment.id} className="border-t">
                        <td className="py-3">{appointment.patient}</td>
                        <td className="py-3">{appointment.time}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {appointment.status}
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
              <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                <Link href="/dashboard/prescriptions/new">Create New Prescription</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                <Link href="/dashboard/lab-tests/new">Order Lab Test</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                <Link href="/dashboard/clinical-notes/new">Add Clinical Notes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
