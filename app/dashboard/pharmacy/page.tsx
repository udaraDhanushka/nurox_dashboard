'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCcw,
  PackageSearch,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for recent prescriptions
const recentPrescriptions = [
  {
    patient: 'John Doe',
    medication: 'Amoxicillin 500mg',
    status: 'Ready',
  },
  {
    patient: 'Jane Smith',
    medication: 'Lisinopril 10mg',
    status: 'Processing',
  },
  {
    patient: 'Mike Johnson',
    medication: 'Metformin 850mg',
    status: 'Out of Stock',
  },
];

export default function PharmacyDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h2>
        <p className="text-muted-foreground">Monitor prescriptions and inventory status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Overview Cards */}
        <Link href="/dashboard/pharmacy/prescriptions" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Prescriptions</p>
                  <h3 className="text-2xl font-bold mt-2">15</h3>
                  <p className="text-xs text-muted-foreground mt-1">Prescriptions waiting to be processed</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/pharmacy/prescriptions" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <h3 className="text-2xl font-bold mt-2">28</h3>
                  <p className="text-xs text-muted-foreground mt-1">Prescriptions fulfilled today</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/pharmacy/inventory/order" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <h3 className="text-2xl font-bold mt-2">8</h3>
                  <p className="text-xs text-muted-foreground mt-1">Items that need reordering</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/pharmacy/inventory" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <h3 className="text-2xl font-bold mt-2">3</h3>
                  <p className="text-xs text-muted-foreground mt-1">Currently unavailable medications</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Prescriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Recent Prescriptions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/pharmacy/prescriptions" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Patient</div>
                <div>Medication</div>
                <div>Status</div>
              </div>
              <div className="space-y-4">
                {recentPrescriptions.map((prescription, index) => (
                  <div key={index} className="grid grid-cols-3 text-sm">
                    <div>{prescription.patient}</div>
                    <div>{prescription.medication}</div>
                    <div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/pharmacy/prescriptions">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Update Prescription Status
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/pharmacy/inventory">
                  <PackageSearch className="mr-2 h-4 w-4" />
                  Check Inventory
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/pharmacy/inventory/order">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place Order for Low Stock
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 