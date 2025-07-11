'use client';

import { useState, useEffect } from 'react';
import { FileText, Pill, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';

// Mock data - replace with real API calls
const mockData = {
  pendingPrescriptions: 15,
  completedToday: 28,
  lowStockItems: 8,
  outOfStockItems: 3,
  recentPrescriptions: [
    { id: 1, patient: 'John Doe', medication: 'Amoxicillin 500mg', status: 'Ready' },
    { id: 2, patient: 'Jane Smith', medication: 'Lisinopril 10mg', status: 'Processing' },
    { id: 3, patient: 'Mike Johnson', medication: 'Metformin 850mg', status: 'Out of Stock' },
  ],
};

export default function PharmacistDashboard() {
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
        <h2 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor prescriptions and inventory status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Prescriptions"
          value={stats.pendingPrescriptions}
          icon={<FileText className="h-4 w-4" />}
          description="Prescriptions waiting to be processed"
        />
        <StatsCard
          title="Completed Today"
          value={stats.completedToday}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Prescriptions fulfilled today"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Items that need reordering"
        />
        <StatsCard
          title="Out of Stock"
          value={stats.outOfStockItems}
          icon={<Pill className="h-4 w-4" />}
          description="Currently unavailable medications"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Prescriptions */}
        <div className="col-span-2">
          <h3 className="text-xl font-semibold mb-4">Recent Prescriptions</h3>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Medication</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="border-t">
                      <td className="py-3">{prescription.patient}</td>
                      <td className="py-3">{prescription.medication}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prescription.status === 'Ready'
                              ? 'bg-green-100 text-green-800'
                              : prescription.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prescription.status}
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
              Update Prescription Status
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
              Check Inventory
            </button>
            <button className="w-full bg-white p-4 rounded-lg shadow text-left hover:bg-gray-50 transition-colors">
              Place Order for Low Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 