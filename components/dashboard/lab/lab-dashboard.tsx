"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  TestTube, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  BarChart,
  LineChart,
  ArrowRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function LabDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  return (
    <div className="flex flex-col space-y-6 p-6">
      <DashboardHeader 
        title="Lab Dashboard" 
        description="Manage lab tests, results, and operations"
        actions={
          <Button>
            Upload Results
          </Button>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Pending Tests"
          value="18"
          icon={<TestTube className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: "+4",
            positive: false,
            label: "from yesterday"
          }}
        />
        <StatCard 
          title="Results Ready"
          value="12"
          icon={<ClipboardList className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: "active",
            label: "To be delivered"
          }}
        />
        <StatCard 
          title="Completed Today"
          value="23"
          icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: "+28%",
            positive: true,
            label: "vs. yesterday"
          }}
        />
        <StatCard 
          title="Abnormal Results"
          value="7"
          icon={<AlertTriangle className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: "warning",
            label: "Needs review"
          }}
        />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">Test Orders</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Pending Test Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Pending Test Orders</CardTitle>
                  <CardDescription>Tests waiting to be processed</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/lab/orders">
                    View all
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      patient: "Sophia Garcia", 
                      doctor: "Dr. Sarah Chen", 
                      test: "Blood Glucose Panel",
                      priority: "high",
                      received: "2 hours ago"
                    },
                    { 
                      patient: "William Chen", 
                      doctor: "Dr. Sarah Chen", 
                      test: "Complete Blood Count",
                      priority: "medium",
                      received: "3 hours ago"
                    },
                    { 
                      patient: "Michael Reeves", 
                      doctor: "Dr. James Wilson", 
                      test: "Chest X-Ray",
                      priority: "high",
                      received: "5 hours ago"
                    },
                    { 
                      patient: "Emma Davis", 
                      doctor: "Dr. Sarah Chen", 
                      test: "Lipid Panel",
                      priority: "low",
                      received: "Yesterday"
                    },
                  ].map((test, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-md border">
                      <div className={cn(
                        "flex-shrink-0 w-1.5 h-16 rounded-full",
                        test.priority === "high" ? "bg-red-500" :
                        test.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                      )}></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{test.patient}</p>
                          <Badge 
                            variant={test.priority === "high" ? "destructive" : 
                                   test.priority === "medium" ? "default" : "outline"}
                            className="text-[10px] h-5"
                          >
                            {test.priority === "high" ? "Urgent" : 
                             test.priority === "medium" ? "Standard" : "Routine"}
                          </Badge>
                        </div>
                        <p className="text-sm">{test.test}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{test.doctor}</span>
                          <span className="mx-1">•</span>
                          <span>Received {test.received}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Process</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Lab Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Lab Performance</CardTitle>
                <CardDescription>Processing times and completion rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Average Processing Time</span>
                    <span>45 minutes</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    25% faster than department average
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Test Accuracy Rate</span>
                    <span>99.2%</span>
                  </div>
                  <Progress value={99.2} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    0.5% above quality target
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">On-Time Delivery</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    3% improvement from last week
                  </p>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm font-medium mb-3">Test Volume by Type</div>
                  <div className="h-[120px] flex items-end gap-2">
                    {[65, 40, 75, 45, 80, 35].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-primary/20 rounded-t-sm relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-sm transition-all duration-300 ease-in-out"
                               style={{ height: `${height}%` }}></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {height}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {['Blood', 'Urine', 'CBC', 'Lipid', 'Gluc', 'Other'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Results and Abnormal Findings */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Recent Results</CardTitle>
                  <CardDescription>Latest processed test results</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/lab/results">
                    View all
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      patient: "William Chen", 
                      test: "Complete Blood Count", 
                      status: "normal",
                      time: "45 minutes ago",
                      technician: "Emily Johnson"
                    },
                    { 
                      patient: "Sophia Garcia", 
                      test: "Blood Glucose Panel", 
                      status: "abnormal",
                      time: "1 hour ago",
                      technician: "Emily Johnson"
                    },
                    { 
                      patient: "Robert Taylor", 
                      test: "Liver Function Test", 
                      status: "normal",
                      time: "2 hours ago",
                      technician: "David Wilson"
                    },
                    { 
                      patient: "Emma Davis", 
                      test: "Lipid Panel", 
                      status: "abnormal",
                      time: "3 hours ago",
                      technician: "Emily Johnson"
                    },
                  ].map((result, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(result.patient)}&background=random`} />
                        <AvatarFallback>{result.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{result.patient}</p>
                          <Badge 
                            variant={result.status === "abnormal" ? "destructive" : "outline"}
                            className="text-[10px] h-5"
                          >
                            {result.status === "abnormal" ? "Abnormal" : "Normal"}
                          </Badge>
                        </div>
                        <p className="text-sm">{result.test}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{result.technician}</span>
                          <span className="mx-1">•</span>
                          <span>{result.time}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Critical Alerts</CardTitle>
                <CardDescription>Test results requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      patient: "Sophia Garcia", 
                      test: "Blood Glucose", 
                      value: "185 mg/dL",
                      reference: "70-99 mg/dL",
                      doctor: "Dr. Sarah Chen",
                      status: "notified"
                    },
                    { 
                      patient: "Emma Davis", 
                      test: "LDL Cholesterol", 
                      value: "210 mg/dL",
                      reference: "<100 mg/dL",
                      doctor: "Dr. Sarah Chen",
                      status: "pending"
                    },
                    { 
                      patient: "James Wilson", 
                      test: "Potassium", 
                      value: "5.9 mmol/L",
                      reference: "3.5-5.0 mmol/L",
                      doctor: "Dr. Michael Brown",
                      status: "pending"
                    },
                  ].map((alert, index) => (
                    <div key={index} className="p-3 rounded-md border bg-red-50 border-red-200">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{alert.patient}</p>
                        <Badge 
                          variant={alert.status === "notified" ? "outline" : "destructive"}
                          className="text-[10px] h-5"
                        >
                          {alert.status === "notified" ? "Doctor Notified" : "Action Required"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{alert.test}:</span>
                        <span className="font-semibold text-red-600">{alert.value}</span>
                        <span className="text-xs text-muted-foreground">(Ref: {alert.reference})</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{alert.doctor}</span>
                        {alert.status === "pending" && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Notify Doctor
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" size="sm" asChild>
                      <Link href="/dashboard/lab/alerts">
                        View All Critical Alerts
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tests">
          <Card className="p-6">
            <p className="text-center py-8">Test orders management interface would be shown here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card className="p-6">
            <p className="text-center py-8">Results management interface would be shown here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}