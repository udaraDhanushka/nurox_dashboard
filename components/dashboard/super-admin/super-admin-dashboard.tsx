"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiService } from '@/lib/api';
import { socketService } from '@/lib/socket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Building2,
  Pill,
  TestTube,
  Shield,
  Users,
  Plus,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  _count?: {
    users: number;
  };
  hospitalId?: string;
}

interface OrganizationsData {
  hospitals: Organization[];
  pharmacies: Organization[];
  laboratories: Organization[];
  insuranceCompanies: Organization[];
  summary: {
    totalHospitals: number;
    totalPharmacies: number;
    totalLaboratories: number;
    totalInsuranceCompanies: number;
  };
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<OrganizationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState<'hospital' | 'pharmacy' | 'laboratory' | 'insurance'>('hospital');
  const [formData, setFormData] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadOrganizations = useCallback(async () => {
    try {
      const response = await apiService.getAllOrganizations();
      if (response.success) {
        setOrganizations(response.data as OrganizationsData);
      } else {
        toast.error('Failed to load organizations');
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  }, []);

  const setupSocketListeners = useCallback(() => {
    // Listen for new organization registrations
    socketService.onNewOrganization((data: any) => {
      toast.info(`New ${data.type} registration: ${data.name}`);
      setNotifications(prev => [data, ...prev.slice(0, 4)]); // Keep only 5 latest
      loadOrganizations(); // Refresh data
    });

    // Listen for admin notifications
    socketService.onAdminNotification((data: any) => {
      toast.info(data.message);
      setNotifications(prev => [data, ...prev.slice(0, 4)]);
    });
  }, [loadOrganizations]);

  useEffect(() => {
    loadOrganizations();
    setupSocketListeners();
  }, [loadOrganizations, setupSocketListeners]);

  const handleCreateOrganization = async () => {
    try {
      let response;
      
      switch (createType) {
        case 'hospital':
          response = await apiService.createHospital(formData);
          break;
        case 'pharmacy':
          response = await apiService.createPharmacy(formData);
          break;
        case 'laboratory':
          response = await apiService.createLaboratory(formData);
          break;
        case 'insurance':
          response = await apiService.createInsuranceCompany(formData);
          break;
      }

      if (response?.success) {
        toast.success(`${createType.charAt(0).toUpperCase() + createType.slice(1)} created successfully`);
        setShowCreateDialog(false);
        setFormData({});
        loadOrganizations();
      } else {
        toast.error(response?.message || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'PENDING_APPROVAL':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'SUSPENDED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const CreateOrganizationForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Organization Type</Label>
        <Select value={createType} onValueChange={(value: any) => setCreateType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
            <SelectItem value="laboratory">Laboratory</SelectItem>
            <SelectItem value="insurance">Insurance Company</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={`Enter ${createType} name`}
        />
      </div>

      <div>
        <Label htmlFor="registrationNumber">Registration Number</Label>
        <Input
          id="registrationNumber"
          value={formData.registrationNumber || ''}
          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
          placeholder="Enter registration number"
        />
      </div>

      <div>
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber || ''}
          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
          placeholder="Enter license number"
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone number"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email address"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input
          id="contactPerson"
          value={formData.contactPerson || ''}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          placeholder="Contact person name"
        />
      </div>

      {createType === 'hospital' && (
        <>
          <div>
            <Label htmlFor="specialties">Specialties (comma-separated)</Label>
            <Input
              id="specialties"
              value={formData.specialtiesText || ''}
              onChange={(e) => {
                const specialties = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setFormData({ 
                  ...formData, 
                  specialtiesText: e.target.value,
                  specialties 
                });
              }}
              placeholder="Cardiology, Neurology, Pediatrics"
            />
          </div>
          <div>
            <Label htmlFor="bedCount">Bed Count</Label>
            <Input
              id="bedCount"
              type="number"
              value={formData.bedCount || ''}
              onChange={(e) => setFormData({ ...formData, bedCount: parseInt(e.target.value) || 0 })}
              placeholder="Number of beds"
            />
          </div>
        </>
      )}

      {createType === 'laboratory' && (
        <div>
          <Label htmlFor="testTypes">Test Types (comma-separated)</Label>
          <Input
            id="testTypes"
            value={formData.testTypesText || ''}
            onChange={(e) => {
              const testTypes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              setFormData({ 
                ...formData, 
                testTypesText: e.target.value,
                testTypes 
              });
            }}
            placeholder="Blood Test, X-Ray, MRI"
          />
        </div>
      )}

      {createType === 'insurance' && (
        <div>
          <Label htmlFor="coverageTypes">Coverage Types (comma-separated)</Label>
          <Input
            id="coverageTypes"
            value={formData.coverageTypesText || ''}
            onChange={(e) => {
              const coverageTypes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              setFormData({ 
                ...formData, 
                coverageTypesText: e.target.value,
                coverageTypes 
              });
            }}
            placeholder="Health, Dental, Vision"
          />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all organizations in the Nurox system</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to the Nurox system
              </DialogDescription>
            </DialogHeader>
            <CreateOrganizationForm />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrganization}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations?.summary.totalHospitals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Healthcare facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pharmacies</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations?.summary.totalPharmacies || 0}</div>
            <p className="text-xs text-muted-foreground">
              Medication dispensers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laboratories</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations?.summary.totalLaboratories || 0}</div>
            <p className="text-xs text-muted-foreground">
              Testing facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations?.summary.totalInsuranceCompanies || 0}</div>
            <p className="text-xs text-muted-foreground">
              Coverage providers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">{notification.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organizations Tabs */}
      <Tabs defaultValue="hospitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
          <TabsTrigger value="laboratories">Laboratories</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospitals</CardTitle>
              <CardDescription>Manage healthcare facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations?.hospitals.map((hospital) => (
                  <div key={hospital.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{hospital.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {hospital._count?.users || 0} users • Created {new Date(hospital.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(hospital.status)}
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
                {organizations?.hospitals.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No hospitals found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacies</CardTitle>
              <CardDescription>Manage pharmacy networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations?.pharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{pharmacy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pharmacy._count?.users || 0} users • 
                        {pharmacy.hospitalId && ' Hospital-owned • '}
                        Created {new Date(pharmacy.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(pharmacy.status)}
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
                {organizations?.pharmacies.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No pharmacies found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laboratories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratories</CardTitle>
              <CardDescription>Manage testing facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations?.laboratories.map((lab) => (
                  <div key={lab.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{lab.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lab._count?.users || 0} users • 
                        {lab.hospitalId && ' Hospital-owned • '}
                        Created {new Date(lab.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(lab.status)}
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
                {organizations?.laboratories.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No laboratories found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Companies</CardTitle>
              <CardDescription>Manage insurance providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations?.insuranceCompanies.map((insurance) => (
                  <div key={insurance.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{insurance.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {insurance._count?.users || 0} users • Created {new Date(insurance.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(insurance.status)}
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
                {organizations?.insuranceCompanies.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No insurance companies found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}