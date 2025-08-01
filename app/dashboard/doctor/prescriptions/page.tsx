'use client';

import { useState } from 'react';
import { FileText, Search, Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Mock data
const prescriptions = [
  {
    id: 1,
    patient: 'John Doe',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    status: 'Active',
    date: '2024-02-15',
  },
  {
    id: 2,
    patient: 'Jane Smith',
    medication: 'Metformin',
    dosage: '1000mg',
    frequency: 'Twice daily',
    duration: '30 days',
    status: 'Completed',
    date: '2024-02-10',
  },
  {
    id: 3,
    patient: 'Mike Johnson',
    medication: 'Ventolin',
    dosage: '100mcg',
    frequency: 'As needed',
    duration: '30 days',
    status: 'Pending',
    date: '2024-02-01',
  },
];

export default function PrescriptionsPage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch =
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' || prescription.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prescriptions</h2>
          <p className="text-muted-foreground">Manage and track patient prescriptions</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/prescriptions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between">
            <CardTitle>Prescription History</CardTitle>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search prescriptions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prescriptions</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPrescriptions.map(prescription => (
              <div
                key={prescription.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-4 sm:space-y-0"
              >
                <div className="flex items-start space-x-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{prescription.patient}</p>
                    <div className="text-sm text-muted-foreground">
                      {prescription.medication} - {prescription.dosage}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prescription.frequency} for {prescription.duration}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {prescription.date}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prescription.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : prescription.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {prescription.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
