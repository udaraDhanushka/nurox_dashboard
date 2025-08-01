'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  BarChart,
  ShieldCheck,
  Users,
  ArrowRight,
  CalendarRange,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function InsurerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="flex flex-col space-y-6 p-6">
      <DashboardHeader
        title="Insurance Dashboard"
        description="Manage claims, policies, and member services"
        actions={<Button>New Claim</Button>}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Claims"
          value="37"
          icon={<ClipboardList className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: 'warning',
            label: '12 urgent',
          }}
        />
        <StatCard
          title="Approved Claims"
          value="158"
          icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: '+12%',
            positive: true,
            label: 'this month',
          }}
        />
        <StatCard
          title="Total Members"
          value="2,845"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: '+64',
            positive: true,
            label: 'new members',
          }}
        />
        <StatCard
          title="Payouts"
          value="$247,580"
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          progress={{
            value: 68,
            label: '68% of monthly budget',
          }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Pending Claims */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Pending Claims</CardTitle>
                  <CardDescription>Claims awaiting review and processing</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/insurer/claims">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      member: 'Sophia Garcia',
                      provider: 'Medical City Hospital',
                      service: 'Emergency Room Visit',
                      amount: '$1,250.00',
                      submitted: '2 days ago',
                      status: 'urgent',
                    },
                    {
                      member: 'William Chen',
                      provider: 'Dr. Sarah Chen',
                      service: 'Cardiac Consultation',
                      amount: '$350.00',
                      submitted: '3 days ago',
                      status: 'normal',
                    },
                    {
                      member: 'Michael Reeves',
                      provider: 'Westside Pharmacy',
                      service: 'Prescription Medication',
                      amount: '$175.50',
                      submitted: '4 days ago',
                      status: 'normal',
                    },
                    {
                      member: 'Emma Davis',
                      provider: 'MetroLab Services',
                      service: 'MRI Scan',
                      amount: '$1,850.00',
                      submitted: '5 days ago',
                      status: 'urgent',
                    },
                  ].map((claim, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-md border">
                      <div
                        className={cn(
                          'flex-shrink-0 w-1.5 h-16 rounded-full',
                          claim.status === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                        )}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{claim.member}</p>
                          <Badge
                            variant={claim.status === 'urgent' ? 'destructive' : 'outline'}
                            className="text-[10px] h-5"
                          >
                            {claim.status === 'urgent' ? 'Urgent' : 'Standard'}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          {claim.provider}: {claim.service}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <span>Submitted {claim.submitted}</span>
                          <span className="font-medium text-foreground">{claim.amount}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Claims Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Claims Analysis</CardTitle>
                <CardDescription>
                  Monthly overview of claims and processing efficiency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Claims Processed</span>
                    <span>198 of 235 (84%)</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-muted-foreground">7% above monthly target</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Average Processing Time</span>
                    <span>2.3 days</span>
                  </div>
                  <Progress value={77} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    0.5 days faster than previous month
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Approval Rate</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  <p className="text-xs text-muted-foreground">2% higher than industry average</p>
                </div>

                <div className="pt-2">
                  <div className="text-sm font-medium mb-3">Claims by Type</div>
                  <div className="h-[120px] flex items-end gap-2">
                    {[65, 85, 45, 35, 55, 25].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-primary/20 rounded-t-sm relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div
                            className="absolute inset-x-0 bottom-0 bg-primary rounded-t-sm transition-all duration-300 ease-in-out"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {height}%
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {['Hospital', 'Doctor', 'Lab', 'Pharmacy', 'ER', 'Other'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Members and Policy Renewals */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Recent Member Activity</CardTitle>
                  <CardDescription>Latest updates from members</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/insurer/members">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      member: 'William Chen',
                      activity: 'Policy updated',
                      details: 'Added dependent coverage',
                      time: 'Yesterday',
                      avatar: true,
                    },
                    {
                      member: 'Sophia Garcia',
                      activity: 'New claim submitted',
                      details: 'Emergency Room Visit',
                      time: '2 days ago',
                      avatar: true,
                    },
                    {
                      member: 'Robert Taylor',
                      activity: 'Information updated',
                      details: 'Changed primary care provider',
                      time: '3 days ago',
                      avatar: true,
                    },
                    {
                      member: 'New Member',
                      activity: 'Account created',
                      details: 'Gold Family Plan',
                      time: '5 days ago',
                      avatar: false,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      {activity.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.member)}&background=random`}
                          />
                          <AvatarFallback>
                            {activity.member
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-grow">
                        <p className="font-medium">{activity.member}</p>
                        <p className="text-sm">
                          {activity.activity}: {activity.details}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Policy Renewals</CardTitle>
                <CardDescription>Policies requiring attention in next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      member: 'James Wilson',
                      policy: 'Premium Family Plan',
                      expires: 'June 28, 2025',
                      status: 'expiring-soon',
                      daysLeft: 18,
                    },
                    {
                      member: 'Linda Martinez',
                      policy: 'Gold Individual Plan',
                      expires: 'July 5, 2025',
                      status: 'pending-review',
                      daysLeft: 25,
                    },
                    {
                      member: 'Michael Reeves',
                      policy: 'Standard Plan + Dental',
                      expires: 'July 12, 2025',
                      status: 'renewal-ready',
                      daysLeft: 32,
                    },
                  ].map((policy, index) => (
                    <div key={index} className="p-3 rounded-md border">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{policy.member}</p>
                        <Badge
                          variant={
                            policy.status === 'expiring-soon'
                              ? 'destructive'
                              : policy.status === 'pending-review'
                                ? 'default'
                                : 'outline'
                          }
                          className="text-[10px] h-5"
                        >
                          {policy.status === 'expiring-soon'
                            ? 'Expiring Soon'
                            : policy.status === 'pending-review'
                              ? 'Needs Review'
                              : 'Renewal Ready'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">{policy.policy}</p>
                        <div className="flex items-center text-xs">
                          <CalendarRange className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{policy.expires}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-xs">
                        <span className="text-muted-foreground">
                          {policy.daysLeft} days remaining
                        </span>
                        <div className="flex-grow mx-2">
                          <Progress
                            value={Math.max(0, Math.min(100, (policy.daysLeft / 30) * 100))}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <Button variant="outline" className="w-full" size="sm" asChild>
                      <Link href="/dashboard/insurer/renewals">
                        Manage All Renewals
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <Card className="p-6">
            <p className="text-center py-8">Claims management interface would be shown here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="p-6">
            <p className="text-center py-8">Members management interface would be shown here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
