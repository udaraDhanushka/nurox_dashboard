'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { parse } from 'date-fns/parse';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addMinutes } from 'date-fns';

// Date-fns localizer setup
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Form schema
const appointmentFormSchema = z.object({
  patient: z.string().min(1, 'Patient name is required'),
  type: z.string().min(1, 'Appointment type is required'),
  duration: z.string().transform(val => parseInt(val, 10)),
  notes: z.string().optional(),
});

// Mock data with full date objects
const appointments = [
  {
    id: 1,
    patient: 'John Doe',
    time: new Date(2024, 1, 15, 9, 0),
    type: 'Regular Checkup',
    status: 'Upcoming',
    notes: 'Annual health checkup',
    duration: 30,
  },
  {
    id: 2,
    patient: 'Jane Smith',
    time: new Date(2024, 1, 15, 10, 30),
    type: 'Follow-up',
    status: 'Completed',
    notes: 'Post-surgery follow-up',
    duration: 45,
  },
  {
    id: 3,
    patient: 'Mike Johnson',
    time: new Date(2024, 1, 15, 14, 0),
    type: 'Consultation',
    status: 'Cancelled',
    notes: 'Initial consultation',
    duration: 30,
  },
];

// Custom Toolbar Component
const CustomToolbar = ({ date, onNavigate, view, onView }: any) => {
  const goToToday = () => {
    onNavigate('TODAY');
  };

  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToMonth = () => {
    onView('month');
  };

  const goToWeek = () => {
    onView('week');
  };

  const goToDay = () => {
    onView('day');
  };

  const dateRange = () => {
    if (view === 'month') {
      return format(date, 'MMMM yyyy');
    }
    if (view === 'week') {
      const start = startOfWeek(date);
      const end = endOfWeek(date);
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
    }
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToToday}
        >
          Today
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold ml-2">
          {dateRange()}
        </span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={goToMonth}
        >
          Month
        </Button>
        <Button 
          variant={view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={goToWeek}
        >
          Week
        </Button>
        <Button 
          variant={view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={goToDay}
        >
          Day
        </Button>
      </div>
    </div>
  );
};

// Add interface for appointment type
interface Appointment {
  id: number;
  patient: string;
  time: Date;
  type: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes: string;
  duration: number;
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>('week');
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);

  // Transform appointments for calendar display with status colors
  const calendarEvents = useMemo(() => {
    return appointmentsList.map(appointment => ({
      title: `${appointment.patient} - ${appointment.type}`,
      start: appointment.time,
      end: addMinutes(appointment.time, appointment.duration),
      resource: appointment,
      style: {
        backgroundColor: appointment.status === 'Completed' ? '#22c55e' :
                        appointment.status === 'Upcoming' ? '#3b82f6' :
                        '#ef4444',
        borderColor: 'transparent',
      },
    }));
  }, [appointmentsList]);

  // Filter appointments based on the current view
  const filteredEvents = useMemo(() => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      if (currentView === 'month') {
        return eventDate >= startOfMonth(selectedDate) && eventDate <= endOfMonth(selectedDate);
      }
      if (currentView === 'week') {
        return eventDate >= startOfWeek(selectedDate) && eventDate <= endOfWeek(selectedDate);
      }
      return isSameDay(eventDate, selectedDate);
    });
  }, [calendarEvents, selectedDate, currentView]);

  // Event handlers
  const handleSelectEvent = (event: any) => {
    setSelectedAppointment(event.resource as Appointment);
    setShowAppointmentModal(true);
  };

  const handleNavigate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleViewChange = (newView: string) => {
    setCurrentView(newView as View);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage your appointments and schedule</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Calendar Section */}
        <Card className="col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                defaultView={currentView}
                view={currentView}
                date={selectedDate}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                views={['month', 'week', 'day']}
                step={30}
                timeslots={2}
                selectable={false}
                components={{
                  toolbar: CustomToolbar
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Today&apos;s Appointments</CardTitle>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentsList
                .filter(appointment => {
                  if (filter === 'all') return true;
                  return appointment.status.toLowerCase() === filter.toLowerCase();
                })
                .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <User className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {format(appointment.time, 'hh:mm a')} - {appointment.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowAppointmentModal(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              {appointmentsList.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No appointments found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Appointment Modal */}
      <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <Label>Patient</Label>
                <p className="text-sm mt-1 font-medium">{selectedAppointment.patient}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p className="text-sm mt-1">{selectedAppointment.type}</p>
              </div>
              <div>
                <Label>Time</Label>
                <p className="text-sm mt-1">{format(selectedAppointment.time, 'PPpp')}</p>
              </div>
              <div>
                <Label>Duration</Label>
                <p className="text-sm mt-1">{selectedAppointment.duration} minutes</p>
              </div>
              <div>
                <Label>Status</Label>
                <span
                  className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedAppointment.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : selectedAppointment.status === 'Upcoming'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
              <div>
                <Label>Notes</Label>
                <p className="text-sm mt-1">{selectedAppointment.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAppointmentModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 