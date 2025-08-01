'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toaster, toast } from 'sonner';

// Mock data
const prescriptions = [
  {
    id: 'RX001',
    patient: 'John Doe',
    medication: 'Amoxicillin 500mg',
    dosage: '1 tablet 3 times daily',
    quantity: 21,
    doctor: 'Dr. Sarah Chen',
    status: 'Ready',
    date: '2024-02-15',
  },
  {
    id: 'RX002',
    patient: 'Jane Smith',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet daily',
    quantity: 30,
    doctor: 'Dr. Michael Brown',
    status: 'Processing',
    date: '2024-02-15',
  },
  {
    id: 'RX003',
    patient: 'Mike Johnson',
    medication: 'Metformin 850mg',
    dosage: '1 tablet twice daily',
    quantity: 60,
    doctor: 'Dr. Sarah Chen',
    status: 'Out of Stock',
    date: '2024-02-14',
  },
];

export default function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleUpdateStatus = (prescription: any) => {
    setSelectedPrescription(prescription);
    setNewStatus(prescription.status);
    setNotes('');
    setShowUpdateModal(true);
  };

  const handleSaveStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically update the prescription status in your database
      console.log('Updating status:', {
        prescriptionId: selectedPrescription?.id,
        newStatus,
        notes,
      });

      toast.success('Prescription status updated successfully');
      setShowUpdateModal(false);
    } catch (error) {
      toast.error('Failed to update prescription status');
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch =
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prescriptions</h2>
          <p className="text-muted-foreground">Manage and process prescriptions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle>All Prescriptions</CardTitle>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search prescriptions..."
                  className="pl-8 md:w-[300px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prescription ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.map(prescription => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">{prescription.id}</TableCell>
                  <TableCell>{prescription.patient}</TableCell>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.quantity}</TableCell>
                  <TableCell>{prescription.doctor}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{prescription.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(prescription)}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Status Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Update Prescription Status</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowUpdateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Prescription Details</Label>
              <div className="text-sm">
                <p>
                  <strong>ID:</strong> {selectedPrescription?.id}
                </p>
                <p>
                  <strong>Patient:</strong> {selectedPrescription?.patient}
                </p>
                <p>
                  <strong>Medication:</strong> {selectedPrescription?.medication}
                </p>
                <p>
                  <strong>Current Status:</strong> {selectedPrescription?.status}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this status update"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? (
                <>
                  <span className="mr-2">Updating...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
