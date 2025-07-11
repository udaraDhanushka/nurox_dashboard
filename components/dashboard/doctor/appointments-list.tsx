"use client";

import { useState } from 'react';
import { 
  CalendarIcon, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { cn } from '@/lib/utils';

// Mock appointment data
const appointments = [
  {
    id: 1,
    patient: { name: "Olivia Thompson", age: 34, gender: "Female" },
    date: new Date(2025, 5, 10, 9, 0),
    type: "Follow-up",
    status: "completed",
    reason: "Hypertension monitoring",
    duration: 30,
    notes: "Patient reported improved symptoms after medication adjustment."
  },
  {
    id: 2,
    patient: { name: "Michael Reeves", age: 28, gender: "Male" },
    date: new Date(2025, 5, 10, 10, 30),
    type: "Consultation",
    status: "completed",
    reason: "Respiratory infection",
    duration: 30,
    notes: "Prescribed antibiotics and recommended rest."
  },
  {
    id: 3,
    patient: { name: "Sophia Garcia", age: 42, gender: "Female" },
    date: new Date(2025, 5, 10, 12, 0),
    type: "Check-up",
    status: "active",
    reason: "Diabetes monitoring",
    duration: 45,
    notes: "Review recent lab results and medication effectiveness."
  },
  {
    id: 4,
    patient: { name: "William Chen", age: 55, gender: "Male" },
    date: new Date(2025, 5, 10, 14, 15),
    type: "Lab Review",
    status: "upcoming",
    reason: "Post-surgery follow-up",
    duration: 30,
    notes: "Check wound healing and recovery progress."
  },
  {
    id: 5,
    patient: { name: "Emma Davis", age: 38, gender: "Female" },
    date: new Date(2025, 5, 10, 15, 45),
    type: "Follow-up",
    status: "upcoming",
    reason: "Medication review",
    duration: 30,
    notes: "Assess effectiveness of new anxiety medication."
  },
  {
    id: 6,
    patient: { name: "James Wilson", age: 61, gender: "Male" },
    date: new Date(2025, 5, 11, 9, 30),
    type: "Annual Exam",
    status: "scheduled",
    reason: "Yearly check-up",
    duration: 60,
    notes: "Comprehensive health assessment and preventive care."
  },
  {
    id: 7,
    patient: { name: "Linda Martinez", age: 47, gender: "Female" },
    date: new Date(2025, 5, 11, 11, 0),
    type: "Consultation",
    status: "scheduled",
    reason: "Joint pain",
    duration: 45,
    notes: "Evaluate chronic knee pain and discuss treatment options."
  },
  {
    id: 8,
    patient: { name: "Robert Taylor", age: 52, gender: "Male" },
    date: new Date(2025, 5, 11, 13, 30),
    type: "Follow-up",
    status: "scheduled",
    reason: "Cardiac monitoring",
    duration: 30,
    notes: "Review recent stress test results and medication efficacy."
  },
];

export function AppointmentsList() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter appointments based on search query, selected date, and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = date ? 
      appointment.date.getDate() === date.getDate() && 
      appointment.date.getMonth() === date.getMonth() && 
      appointment.date.getFullYear() === date.getFullYear() 
      : true;
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Appointments" 
        description="Manage and schedule patient appointments"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Create a new appointment by filling out the details below.
                </DialogDescription>
              </DialogHeader>
              {/* Add appointment form here */}
            </DialogContent>
          </Dialog>
        }
      />
      
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search appointments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-[240px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                  {date && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDate(undefined);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr 
                  key={appointment.id} 
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.patient.name)}&background=random`} />
                        <AvatarFallback>{appointment.patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.patient.age} yrs, {appointment.patient.gender}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                      <span>{format(appointment.date, "MMM d, yyyy")}</span>
                      <span className="mx-1 text-muted-foreground">•</span>
                      <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                      <span>{format(appointment.date, "h:mm a")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{appointment.duration} min</p>
                  </td>
                  <td className="py-3 px-4">
                    <p>{appointment.type}</p>
                    <p className="text-xs text-muted-foreground">{appointment.reason}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      appointment.status === "active" && "bg-blue-100 text-blue-800",
                      appointment.status === "completed" && "bg-green-100 text-green-800",
                      appointment.status === "upcoming" && "bg-yellow-100 text-yellow-800",
                      appointment.status === "scheduled" && "bg-purple-100 text-purple-800",
                      appointment.status === "cancelled" && "bg-red-100 text-red-800"
                    )}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant={appointment.status === "active" ? "default" : "outline"} 
                          size="sm"
                          className={appointment.status === "completed" ? "pointer-events-none opacity-50" : ""}
                        >
                          {appointment.status === "active" ? "Start Session" : 
                           appointment.status === "completed" ? "View Report" : "View Details"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Appointment Details</DialogTitle>
                          <DialogDescription>
                            View and manage appointment information for {appointment.patient.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid gap-2">
                            <h4 className="font-medium">Appointment Information</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.type} - {appointment.reason}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(appointment.date, "PPP")} at {format(appointment.date, "h:mm a")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Duration: {appointment.duration} minutes
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <h4 className="font-medium">Notes</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.notes}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No appointments found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAppointments.length} of {appointments.length} appointments
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