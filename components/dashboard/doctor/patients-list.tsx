"use client";

import { useState } from 'react';
import { 
  Clipboard, 
  FileText, 
  Search, 
  Plus, 
  Activity, 
  Pill,
  TestTube,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock patient data
const patients = [
  {
    id: 1,
    name: "Olivia Thompson",
    age: 34,
    gender: "Female",
    lastVisit: "2025-06-10",
    conditions: ["Hypertension", "Asthma"],
    alertStatus: null,
    nextAppointment: "2025-07-15",
    lastNotes: "Patient reported improved symptoms after medication adjustment."
  },
  {
    id: 2,
    name: "Michael Reeves",
    age: 28,
    gender: "Male",
    lastVisit: "2025-06-10",
    conditions: ["Respiratory infection"],
    alertStatus: null,
    nextAppointment: "2025-06-24",
    lastNotes: "Prescribed antibiotics and recommended rest."
  },
  {
    id: 3,
    name: "Sophia Garcia",
    age: 42,
    gender: "Female",
    lastVisit: "2025-06-10",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    alertStatus: "High blood sugar",
    nextAppointment: "2025-06-17",
    lastNotes: "Recent blood glucose readings showing consistent elevation."
  },
  {
    id: 4,
    name: "William Chen",
    age: 55,
    gender: "Male",
    lastVisit: "2025-06-10",
    conditions: ["Post cardiac surgery"],
    alertStatus: null,
    nextAppointment: "2025-06-24",
    lastNotes: "Recovery progressing well. Patient reporting improved mobility."
  },
  {
    id: 5,
    name: "Emma Davis",
    age: 38,
    gender: "Female",
    lastVisit: "2025-06-10",
    conditions: ["Anxiety", "Insomnia"],
    alertStatus: null,
    nextAppointment: "2025-06-30",
    lastNotes: "New medication helping with sleep pattern. Still experiencing morning anxiety."
  },
  {
    id: 6,
    name: "James Wilson",
    age: 61,
    gender: "Male",
    lastVisit: "2025-05-15",
    conditions: ["Arthritis", "Hyperlipidemia"],
    alertStatus: "Medication alert",
    nextAppointment: "2025-07-05",
    lastNotes: "Statin medication causing muscle pain. Consider alternative therapy."
  },
  {
    id: 7,
    name: "Linda Martinez",
    age: 47,
    gender: "Female",
    lastVisit: "2025-05-22",
    conditions: ["Osteoarthritis"],
    alertStatus: null,
    nextAppointment: "2025-06-22",
    lastNotes: "Physical therapy showing good results. Pain level decreased from 7/10 to 4/10."
  },
  {
    id: 8,
    name: "Robert Taylor",
    age: 52,
    gender: "Male",
    lastVisit: "2025-05-28",
    conditions: ["Coronary Artery Disease", "Hypertension"],
    alertStatus: null,
    nextAppointment: "2025-06-28",
    lastNotes: "Blood pressure well-controlled. EKG shows normal sinus rhythm."
  },
];

export function PatientsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter patients based on search query and active tab
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.conditions.some(condition => 
        condition.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'alerts' && patient.alertStatus !== null);
    
    return matchesSearch && matchesTab;
  });
  
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Patients" 
        description="Manage your patient records and medical history"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        }
      />
      
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients by name or condition..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              With Alerts
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {patients.filter(p => p.alertStatus !== null).length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="border rounded-md overflow-hidden">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Conditions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Visit</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Appointment</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} />
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{patient.name}</p>
                          {patient.alertStatus && (
                            <Badge variant="destructive" className="px-1.5 py-0 text-[10px] h-4 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-0.5" />
                              Alert
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {patient.age} yrs, {patient.gender}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {patient.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="font-normal">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p>{new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{patient.lastNotes}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p>{new Date(patient.nextAppointment).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" title="Patient Records">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Prescriptions">
                        <Pill className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Lab Tests">
                        <TestTube className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No patients found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              1
            </Button>
            <Button variant="ghost" size="sm">
              2
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}