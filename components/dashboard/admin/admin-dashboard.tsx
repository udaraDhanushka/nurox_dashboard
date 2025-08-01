'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Activity,
  Settings,
  Bell,
  Shield,
  AlertTriangle,
  ServerCrash,
  Check,
  Terminal,
  Layers,
  ChevronRight,
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

export function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="flex flex-col space-y-6 p-6">
      <DashboardHeader
        title="Admin Dashboard"
        description="System overview and administration"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Announcements
            </Button>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Users"
          value="2,847"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: '+143',
            positive: true,
            label: 'this month',
          }}
        />
        <StatCard
          title="System Health"
          value="98%"
          icon={<Activity className="h-5 w-5 text-muted-foreground" />}
          progress={{
            value: 98,
            label: 'All systems normal',
          }}
        />
        <StatCard
          title="Security Alerts"
          value="2"
          icon={<Shield className="h-5 w-5 text-muted-foreground" />}
          indicator={{
            status: 'warning',
            label: 'Needs review',
          }}
        />
        <StatCard
          title="API Requests"
          value="1.2M"
          icon={<Layers className="h-5 w-5 text-muted-foreground" />}
          trend={{
            value: '+18%',
            positive: true,
            label: 'vs. last week',
          }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* User Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Active users by role in the past 24 hours</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/admin/users">Manage Users</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { role: 'Doctors', count: 128, total: 145, percent: 88 },
                    { role: 'Pharmacists', count: 42, total: 52, percent: 81 },
                    { role: 'Lab Technicians', count: 35, total: 40, percent: 87 },
                    { role: 'Insurance Agents', count: 62, total: 75, percent: 83 },
                    { role: 'Administrators', count: 8, total: 10, percent: 80 },
                  ].map((user, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{user.role}</span>
                        <span>
                          {user.count} / {user.total} ({user.percent}%)
                        </span>
                      </div>
                      <Progress value={user.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current status of all system components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      component: 'Authentication Services',
                      status: 'operational',
                      metric: '99.99% uptime',
                      load: 'Low',
                    },
                    {
                      component: 'Database Clusters',
                      status: 'operational',
                      metric: '45ms response time',
                      load: 'Moderate',
                    },
                    {
                      component: 'API Gateway',
                      status: 'operational',
                      metric: '1.2K req/s',
                      load: 'High',
                    },
                    {
                      component: 'Storage Services',
                      status: 'partial_outage',
                      metric: '95% performance',
                      load: 'High',
                      message: 'Degraded performance in us-west region',
                    },
                    {
                      component: 'Notification Service',
                      status: 'operational',
                      metric: '2.5s avg. delivery',
                      load: 'Low',
                    },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-3 w-3 rounded-full',
                            service.status === 'operational'
                              ? 'bg-green-500'
                              : service.status === 'partial_outage'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          )}
                        ></div>
                        <div>
                          <p className="font-medium">{service.component}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{service.metric}</span>
                            <span>•</span>
                            <span>Load: {service.load}</span>
                          </div>
                          {service.message && (
                            <p className="text-xs text-yellow-600 mt-1">{service.message}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Recent System Logs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Recent System Logs</CardTitle>
                  <CardDescription>Important system events</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/admin/logs">All Logs</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      event: 'Database backup completed',
                      level: 'info',
                      timestamp: '10 minutes ago',
                      details: 'Full backup completed successfully',
                    },
                    {
                      event: 'High API traffic detected',
                      level: 'warning',
                      timestamp: '45 minutes ago',
                      details: 'Rate limiting applied to external API endpoints',
                    },
                    {
                      event: 'Failed login attempts',
                      level: 'error',
                      timestamp: '1 hour ago',
                      details: 'Multiple failed attempts for admin user',
                    },
                    {
                      event: 'System update scheduled',
                      level: 'info',
                      timestamp: '2 hours ago',
                      details: 'Maintenance window: Tomorrow, 2:00 AM UTC',
                    },
                    {
                      event: 'SSL certificate renewed',
                      level: 'info',
                      timestamp: '5 hours ago',
                      details: 'Successfully renewed for all domains',
                    },
                  ].map((log, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div
                        className={cn(
                          'mt-1 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center',
                          log.level === 'info'
                            ? 'bg-blue-100'
                            : log.level === 'warning'
                              ? 'bg-yellow-100'
                              : 'bg-red-100'
                        )}
                      >
                        {log.level === 'info' ? (
                          <Terminal className="h-3 w-3 text-blue-600" />
                        ) : log.level === 'warning' ? (
                          <AlertTriangle className="h-3 w-3 text-yellow-600" />
                        ) : (
                          <ServerCrash className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{log.event}</p>
                          <Badge
                            variant={
                              log.level === 'info'
                                ? 'outline'
                                : log.level === 'warning'
                                  ? 'default'
                                  : 'destructive'
                            }
                            className="text-[10px] h-5"
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Center */}
            <Card>
              <CardHeader>
                <CardTitle>Security Center</CardTitle>
                <CardDescription>Security status and recent alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <p className="font-medium">HIPAA Compliance</p>
                      </div>
                      <p className="text-sm">All requirements met</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <p className="font-medium">Data Encryption</p>
                      </div>
                      <p className="text-sm">AES-256 active</p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <h4 className="text-sm font-medium">Recent Security Alerts</h4>

                    {[
                      {
                        alert: 'Multiple login attempts',
                        level: 'high',
                        timestamp: '1 hour ago',
                        details: '5 failed login attempts from IP 212.45.67.89',
                        status: 'unresolved',
                      },
                      {
                        alert: 'Unusual data access pattern',
                        level: 'medium',
                        timestamp: '5 hours ago',
                        details: 'User accessed abnormally high number of patient records',
                        status: 'under_review',
                      },
                      {
                        alert: 'System file modified',
                        level: 'high',
                        timestamp: 'Yesterday',
                        details: 'Configuration file changed outside change window',
                        status: 'resolved',
                      },
                    ].map((alert, index) => (
                      <div
                        key={index}
                        className={cn(
                          'p-3 rounded-md border',
                          alert.status === 'unresolved'
                            ? 'bg-red-50 border-red-200'
                            : alert.status === 'under_review'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-neutral-50 border-neutral-200'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{alert.alert}</p>
                            <Badge
                              variant={
                                alert.level === 'high'
                                  ? 'destructive'
                                  : alert.level === 'medium'
                                    ? 'default'
                                    : 'outline'
                              }
                              className="text-[10px] h-5"
                            >
                              {alert.level.toUpperCase()}
                            </Badge>
                          </div>
                          <Badge
                            variant={
                              alert.status === 'unresolved'
                                ? 'destructive'
                                : alert.status === 'under_review'
                                  ? 'default'
                                  : 'outline'
                            }
                            className="text-[10px] h-5"
                          >
                            {alert.status === 'unresolved'
                              ? 'Unresolved'
                              : alert.status === 'under_review'
                                ? 'Reviewing'
                                : 'Resolved'}
                          </Badge>
                        </div>
                        <p className="text-sm">{alert.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full" size="sm" asChild>
                      <Link href="/dashboard/admin/security">
                        View Security Center
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <p className="text-center py-8">User management interface would be shown here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-6">
            <p className="text-center py-8">System logs interface would be shown here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
