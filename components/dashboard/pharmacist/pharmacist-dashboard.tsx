'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Package,
  Check,
  Clock,
  AlertTriangle,
  ChevronRight,
  PlusCircle,
  ArrowDownUp,
  BarChart,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function PharmacistDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="flex flex-col space-y-6 p-6">
      <DashboardHeader
        title="Pharmacy Dashboard"
        description="Manage prescriptions, inventory, and pharmacy operations"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Working Hours
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Prescriptions"
          value="24"
          icon={<ClipboardList className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: 'warning',
            label: '8 urgent',
          }}
        />
        <StatCard
          title="Dispensed Today"
          value="42"
          icon={<Check className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: '+15%',
            positive: true,
            label: 'vs. yesterday',
          }}
        />
        <StatCard
          title="Low Stock Items"
          value="12"
          icon={<AlertTriangle className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: 'error',
            label: '3 critical',
          }}
        />
        <StatCard
          title="Total Sales"
          value="$3,845"
          icon={<BarChart className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: '+8%',
            positive: true,
            label: 'this week',
          }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Pending Prescriptions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Pending Prescriptions</CardTitle>
                  <CardDescription>Prescriptions waiting to be dispensed</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/pharmacist/prescriptions">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      patient: 'Sophia Garcia',
                      doctor: 'Dr. Sarah Chen',
                      medication: 'Metformin 500mg',
                      urgency: 'high',
                      time: '10:15 AM',
                    },
                    {
                      patient: 'Michael Reeves',
                      doctor: 'Dr. Sarah Chen',
                      medication: 'Amoxicillin 500mg',
                      urgency: 'medium',
                      time: '11:30 AM',
                    },
                    {
                      patient: 'Emma Davis',
                      doctor: 'Dr. James Wilson',
                      medication: 'Escitalopram 10mg',
                      urgency: 'low',
                      time: '1:45 PM',
                    },
                    {
                      patient: 'William Chen',
                      doctor: 'Dr. Sarah Chen',
                      medication: 'Warfarin 5mg',
                      urgency: 'high',
                      time: '2:20 PM',
                    },
                  ].map((prescription, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-md border">
                      <div
                        className={cn(
                          'flex-shrink-0 w-1.5 h-16 rounded-full',
                          prescription.urgency === 'high'
                            ? 'bg-red-500'
                            : prescription.urgency === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        )}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{prescription.patient}</p>
                          <Badge
                            variant={
                              prescription.urgency === 'high'
                                ? 'destructive'
                                : prescription.urgency === 'medium'
                                  ? 'default'
                                  : 'outline'
                            }
                            className="text-[10px] h-5"
                          >
                            {prescription.urgency === 'high'
                              ? 'Urgent'
                              : prescription.urgency === 'medium'
                                ? 'Standard'
                                : 'Routine'}
                          </Badge>
                        </div>
                        <p className="text-sm">{prescription.medication}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{prescription.doctor}</span>
                          <span className="mx-1">•</span>
                          <span>{prescription.time}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Process
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Monitor stock levels and reorder needs</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/pharmacist/inventory">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Metformin 500mg',
                      category: 'Antidiabetic',
                      status: 'low',
                      current: 14,
                      min: 20,
                      max: 100,
                    },
                    {
                      name: 'Lisinopril 10mg',
                      category: 'Antihypertensive',
                      status: 'normal',
                      current: 43,
                      min: 15,
                      max: 80,
                    },
                    {
                      name: 'Amoxicillin 500mg',
                      category: 'Antibiotic',
                      status: 'critical',
                      current: 5,
                      min: 25,
                      max: 150,
                    },
                    {
                      name: 'Atorvastatin 20mg',
                      category: 'Statin',
                      status: 'normal',
                      current: 67,
                      min: 20,
                      max: 100,
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <Badge
                          variant={
                            item.status === 'critical'
                              ? 'destructive'
                              : item.status === 'low'
                                ? 'default'
                                : 'outline'
                          }
                          className="text-[10px] h-5"
                        >
                          {item.status === 'critical'
                            ? 'Critical'
                            : item.status === 'low'
                              ? 'Low Stock'
                              : 'In Stock'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{item.current} units</span>
                          <span>
                            {item.min} min / {item.max} max
                          </span>
                        </div>
                        <Progress value={(item.current / item.max) * 100} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ArrowDownUp className="mr-2 h-4 w-4" />
                  Manage Inventory
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and updates in the pharmacy system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Prescription dispensed',
                    details: 'Amoxicillin 500mg for Michael Reeves',
                    time: '10 minutes ago',
                    user: 'John Williams',
                  },
                  {
                    action: 'Inventory updated',
                    details: '15 units of Metformin 500mg added to stock',
                    time: '45 minutes ago',
                    user: 'John Williams',
                  },
                  {
                    action: 'New prescription received',
                    details: 'Warfarin 5mg for William Chen',
                    time: '1 hour ago',
                    user: 'System',
                  },
                  {
                    action: 'Stock alert triggered',
                    details: 'Amoxicillin 500mg below minimum threshold',
                    time: '2 hours ago',
                    user: 'System',
                  },
                  {
                    action: 'Prescription dispensed',
                    details: 'Escitalopram 10mg for Emma Davis',
                    time: '3 hours ago',
                    user: 'Lisa Thompson',
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {activity.action.includes('Prescription') ? (
                        <ClipboardList className="h-4 w-4 text-primary" />
                      ) : activity.action.includes('Inventory') ? (
                        <Package className="h-4 w-4 text-primary" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm">{activity.details}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{activity.user}</span>
                        <span className="mx-1">•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card className="p-6">
            <p className="text-center py-8">
              Prescriptions management interface would be shown here.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="p-6">
            <p className="text-center py-8">Inventory management interface would be shown here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
