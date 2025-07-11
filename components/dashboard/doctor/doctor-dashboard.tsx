"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MoreHorizontal, 
  User, 
  Users,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { AppointmentsList } from '@/components/dashboard/doctor/appointments-list';
import { PatientsList } from '@/components/dashboard/doctor/patients-list';

export function DoctorDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  return (
    <div className="flex flex-col space-y-6 p-6">
      <DashboardHeader 
        title="Doctor Dashboard" 
        description="Manage your patients, appointments, and prescriptions"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Working Hours
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Patients"
          value="175"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: "+12%",
            positive: true,
            label: "from last month"
          }}
        />
        <StatCard 
          title="Today's Appointments"
          value="12"
          icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: "active",
            label: "Next in 15 min"
          }}
        />
        <StatCard 
          title="Pending Reports"
          value="8"
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: "warning",
            label: "Needs review"
          }}
        />
        <StatCard 
          title="Completed Today"
          value="7/12"
          icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />}
          progress={{
            value: 58,
            label: "Today's progress"
          }}
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Today's Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Today&apos;s Schedule</CardTitle>
                  <CardDescription>You have 5 appointments today</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/doctor/appointments">
                    View all
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "09:00 AM", name: "Olivia Thompson", type: "Follow Up", status: "completed" },
                    { time: "10:30 AM", name: "Michael Reeves", type: "Consultation", status: "completed" },
                    { time: "12:00 PM", name: "Sophia Garcia", type: "Check-up", status: "active" },
                    { time: "02:15 PM", name: "William Chen", type: "Lab Review", status: "upcoming" },
                    { time: "03:45 PM", name: "Emma Davis", type: "Follow Up", status: "upcoming" },
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={cn(
                        "flex-shrink-0 w-1 h-16 rounded-full",
                        appointment.status === "completed" ? "bg-green-500" :
                        appointment.status === "active" ? "bg-blue-500" : "bg-gray-300"
                      )}></div>
                      <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">
                        {appointment.time}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{appointment.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                      <Button 
                        variant={appointment.status === "completed" ? "ghost" : 
                                appointment.status === "active" ? "default" : "outline"}
                        size="sm"
                        className={appointment.status === "completed" ? "pointer-events-none opacity-50" : ""}
                      >
                        {appointment.status === "completed" ? "Completed" : 
                         appointment.status === "active" ? "Start Session" : "Prepare"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Patients */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>You&apos;ve seen 12 patients this week</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/doctor/patients">
                    View all
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: "Olivia Thompson", 
                      dob: "34-year-old female", 
                      condition: "Hypertension, Follow-up",
                      alert: false 
                    },
                    { 
                      name: "Michael Reeves", 
                      dob: "28-year-old male", 
                      condition: "Respiratory infection",
                      alert: false 
                    },
                    { 
                      name: "Sophia Garcia", 
                      dob: "42-year-old female", 
                      condition: "Diabetes monitoring",
                      alert: true,
                      alertText: "High blood sugar" 
                    },
                    { 
                      name: "William Chen", 
                      dob: "55-year-old male", 
                      condition: "Post-surgery follow-up",
                      alert: false
                    },
                  ].map((patient, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} />
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{patient.name}</p>
                          {patient.alert && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {patient.alertText}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.dob}</p>
                        <p className="text-sm">{patient.condition}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/doctor/patients">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Patient
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Activity Chart and Lab Results */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Patient visits overview for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end gap-2">
                  {[30, 45, 25, 60, 75, 45, 65].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-primary/20 rounded-t-sm relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-sm transition-all duration-300 ease-in-out"
                             style={{ height: `${height}%` }}></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {height}%
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Results</CardTitle>
                <CardDescription>Latest patient test results received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      patient: "Sophia Garcia", 
                      test: "Blood Glucose", 
                      result: "185 mg/dL",
                      status: "abnormal",
                      date: "Today, 9:42 AM"
                    },
                    { 
                      patient: "William Chen", 
                      test: "Complete Blood Count", 
                      result: "Within range",
                      status: "normal",
                      date: "Yesterday, 2:15 PM"
                    },
                    { 
                      patient: "Emma Davis", 
                      test: "Lipid Panel", 
                      result: "Elevated LDL",
                      status: "abnormal",
                      date: "Yesterday, 10:30 AM"
                    },
                  ].map((result, index) => (
                    <div key={index} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{result.patient}</p>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            result.status === "abnormal" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-green-100 text-green-800"
                          )}>
                            {result.status === "abnormal" ? "Abnormal" : "Normal"}
                          </span>
                        </div>
                        <p className="text-sm">{result.test}: <span className={result.status === "abnormal" ? "text-red-600 font-medium" : ""}>{result.result}</span></p>
                        <p className="text-xs text-muted-foreground">{result.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/doctor/lab-tests">
                    View All Results
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentsList />
        </TabsContent>
        
        <TabsContent value="patients">
          <PatientsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}