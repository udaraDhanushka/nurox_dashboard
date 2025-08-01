'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  TestTube,
  User,
  Users,
  ShieldCheck,
  Package,
  Activity,
  Calculator,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

// Define sidebar items for each role
const sidebarItemsByRole: Record<string, SidebarItem[]> = {
  DOCTOR: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/doctor' },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Appointments',
      href: '/dashboard/doctor/appointments',
    },
    { icon: <User className="h-5 w-5" />, label: 'Patients', href: '/dashboard/doctor/patients' },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Prescriptions',
      href: '/dashboard/doctor/prescriptions',
    },
    {
      icon: <TestTube className="h-5 w-5" />,
      label: 'Lab Tests',
      href: '/dashboard/doctor/lab-tests',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/doctor/messages',
    },
  ],
  PATIENT: [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Overview',
      href: '/dashboard/patient',
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Appointments',
      href: '/dashboard/patient/appointments',
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Prescriptions',
      href: '/dashboard/patient/prescriptions',
    },
    {
      icon: <TestTube className="h-5 w-5" />,
      label: 'Lab Results',
      href: '/dashboard/patient/lab-results',
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: 'Insurance',
      href: '/dashboard/patient/insurance',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/patient/messages',
    },
  ],
  PHARMACIST: [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Overview',
      href: '/dashboard/pharmacist',
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Prescriptions',
      href: '/dashboard/pharmacist/prescriptions',
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: 'Inventory',
      href: '/dashboard/pharmacist/inventory',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Patients',
      href: '/dashboard/pharmacist/patients',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/pharmacist/messages',
    },
  ],
  MLT: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/mlt' },
    { icon: <TestTube className="h-5 w-5" />, label: 'Test Orders', href: '/dashboard/mlt/orders' },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Test Results',
      href: '/dashboard/mlt/results',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'Analytics',
      href: '/dashboard/mlt/analytics',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/mlt/messages',
    },
  ],
  HOSPITAL_ADMIN: [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Overview',
      href: '/dashboard/hospital',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Staff Management',
      href: '/dashboard/hospital/staff',
    },
    {
      icon: <User className="h-5 w-5" />,
      label: 'Doctor Verification',
      href: '/dashboard/hospital/doctors',
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Appointments',
      href: '/dashboard/hospital/appointments',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'Analytics',
      href: '/dashboard/hospital/analytics',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      href: '/dashboard/hospital/settings',
    },
  ],
  PHARMACY_ADMIN: [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Overview',
      href: '/dashboard/pharmacy',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Staff Management',
      href: '/dashboard/pharmacy/staff',
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: 'Inventory',
      href: '/dashboard/pharmacy/inventory',
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Prescriptions',
      href: '/dashboard/pharmacy/prescriptions',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'Analytics',
      href: '/dashboard/pharmacy/analytics',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      href: '/dashboard/pharmacy/settings',
    },
  ],
  LAB_ADMIN: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/lab' },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Staff Management',
      href: '/dashboard/lab/staff',
    },
    { icon: <TestTube className="h-5 w-5" />, label: 'Test Orders', href: '/dashboard/lab/orders' },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Test Results',
      href: '/dashboard/lab/results',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'Analytics',
      href: '/dashboard/lab/analytics',
    },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/dashboard/lab/settings' },
  ],
  INSURANCE_ADMIN: [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Overview',
      href: '/dashboard/insurer',
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Claims',
      href: '/dashboard/insurer/claims',
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: 'Policies',
      href: '/dashboard/insurer/policies',
    },
    { icon: <Users className="h-5 w-5" />, label: 'Members', href: '/dashboard/insurer/members' },
    {
      icon: <Calculator className="h-5 w-5" />,
      label: 'Billing',
      href: '/dashboard/insurer/billing',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      href: '/dashboard/insurer/settings',
    },
  ],
  INSURANCE_AGENT: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/agent' },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Claims',
      href: '/dashboard/agent/claims',
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: 'Policies',
      href: '/dashboard/agent/policies',
    },
    { icon: <Users className="h-5 w-5" />, label: 'Clients', href: '/dashboard/agent/clients' },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/agent/messages',
    },
  ],
  SUPER_ADMIN: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/admin' },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Organizations',
      href: '/dashboard/admin/organizations',
    },
    {
      icon: <User className="h-5 w-5" />,
      label: 'User Management',
      href: '/dashboard/admin/users',
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: 'Verifications',
      href: '/dashboard/admin/verifications',
    },
    { icon: <Activity className="h-5 w-5" />, label: 'System Logs', href: '/dashboard/admin/logs' },
    { icon: <FileText className="h-5 w-5" />, label: 'Reports', href: '/dashboard/admin/reports' },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'System Settings',
      href: '/dashboard/admin/settings',
    },
  ],
  // Legacy support
  doctor: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/doctor' },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Appointments',
      href: '/dashboard/doctor/appointments',
    },
    { icon: <User className="h-5 w-5" />, label: 'Patients', href: '/dashboard/doctor/patients' },
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Prescriptions',
      href: '/dashboard/doctor/prescriptions',
    },
    {
      icon: <TestTube className="h-5 w-5" />,
      label: 'Lab Tests',
      href: '/dashboard/doctor/lab-tests',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/doctor/messages',
    },
  ],
  pharmacist: [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Overview',
      href: '/dashboard/pharmacist',
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Prescriptions',
      href: '/dashboard/pharmacist/prescriptions',
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: 'Inventory',
      href: '/dashboard/pharmacist/inventory',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Patients',
      href: '/dashboard/pharmacist/patients',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/pharmacist/messages',
    },
  ],
  lab: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/lab' },
    { icon: <TestTube className="h-5 w-5" />, label: 'Test Orders', href: '/dashboard/lab/orders' },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Test Results',
      href: '/dashboard/lab/results',
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: 'Analytics',
      href: '/dashboard/lab/analytics',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Messages',
      href: '/dashboard/lab/messages',
    },
  ],
  insurer: [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Overview',
      href: '/dashboard/insurer',
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: 'Claims',
      href: '/dashboard/insurer/claims',
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: 'Policies',
      href: '/dashboard/insurer/policies',
    },
    { icon: <Users className="h-5 w-5" />, label: 'Members', href: '/dashboard/insurer/members' },
    {
      icon: <Calculator className="h-5 w-5" />,
      label: 'Billing',
      href: '/dashboard/insurer/billing',
    },
  ],
  admin: [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', href: '/dashboard/admin' },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'User Management',
      href: '/dashboard/admin/users',
    },
    { icon: <Activity className="h-5 w-5" />, label: 'System Logs', href: '/dashboard/admin/logs' },
    { icon: <FileText className="h-5 w-5" />, label: 'Reports', href: '/dashboard/admin/reports' },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'System Settings',
      href: '/dashboard/admin/settings',
    },
  ],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: string;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const sidebarItems = sidebarItemsByRole[role] || [];

  // Get role title
  const getRoleTitle = () => {
    switch (role) {
      case 'DOCTOR':
      case 'doctor':
        return 'Doctor';
      case 'PATIENT':
        return 'Patient';
      case 'PHARMACIST':
      case 'pharmacist':
        return 'Pharmacist';
      case 'MLT':
      case 'lab':
        return 'Medical Lab Technician';
      case 'HOSPITAL_ADMIN':
        return 'Hospital Administrator';
      case 'PHARMACY_ADMIN':
        return 'Pharmacy Administrator';
      case 'LAB_ADMIN':
        return 'Laboratory Administrator';
      case 'INSURANCE_ADMIN':
      case 'insurer':
        return 'Insurance Administrator';
      case 'INSURANCE_AGENT':
        return 'Insurance Agent';
      case 'SUPER_ADMIN':
      case 'admin':
        return 'System Administrator';
      default:
        return 'User';
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.replace('/login');
  };

  // The parent layout handles authentication, so we can assume user exists here

  const userInitials = (user?.name || 'User')
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <h1 className="text-xl font-bold text-primary">Nurox</h1>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {sidebarItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{getRoleTitle()}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="p-6 border-b">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">H</span>
              </div>
              <h1 className="text-xl font-bold text-primary">Nurox</h1>
            </Link>
          </div>

          <div className="py-4">
            <nav className="space-y-1 px-2">
              {sidebarItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{getRoleTitle()}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-4 sm:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">H</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center ml-auto gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User menu - desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden md:flex">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{getRoleTitle()}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User avatar - mobile */}
            <Avatar className="md:hidden h-8 w-8">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
