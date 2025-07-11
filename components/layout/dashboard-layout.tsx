'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Beaker,
  Pill,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { NotificationsMenu } from '@/components/notifications';

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const roleNavItems: Record<string, NavItem[]> = {
  doctor: [
    { title: 'Overview', href: '/dashboard/doctor', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Appointments', href: '/dashboard/doctor/appointments', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Patients', href: '/dashboard/doctor/patients', icon: <Users className="w-5 h-5" /> },
    { title: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: <FileText className="w-5 h-5" /> },
    { title: 'Lab Tests', href: '/dashboard/doctor/lab-tests', icon: <Beaker className="w-5 h-5" /> },
  ],
  pharmacist: [
    { title: 'Overview', href: '/dashboard/pharmacist', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Prescriptions', href: '/dashboard/pharmacist/prescriptions', icon: <FileText className="w-5 h-5" /> },
    { title: 'Inventory', href: '/dashboard/pharmacist/inventory', icon: <Pill className="w-5 h-5" /> },
  ],
  lab: [
    { title: 'Overview', href: '/dashboard/lab', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Test Orders', href: '/dashboard/lab/test-orders', icon: <FileText className="w-5 h-5" /> },
    { title: 'Test Types', href: '/dashboard/lab/test-types', icon: <Beaker className="w-5 h-5" /> },
  ],
  insurer: [
    { title: 'Overview', href: '/dashboard/insurer', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Claims', href: '/dashboard/insurer/claims', icon: <FileText className="w-5 h-5" /> },
    { title: 'Patients', href: '/dashboard/insurer/patients', icon: <Users className="w-5 h-5" /> },
  ],
  admin: [
    { title: 'Overview', href: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Users', href: '/dashboard/admin/users', icon: <Users className="w-5 h-5" /> },
    { title: 'Analytics', href: '/dashboard/admin/analytics', icon: <FileText className="w-5 h-5" /> },
    { title: 'Settings', href: '/dashboard/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ],
  SUPER_ADMIN: [
    { title: 'Overview', href: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Organizations', href: '/dashboard/admin/organizations', icon: <Users className="w-5 h-5" /> },
    { title: 'User Management', href: '/dashboard/admin/users', icon: <Users className="w-5 h-5" /> },
    { title: 'System Logs', href: '/dashboard/admin/logs', icon: <FileText className="w-5 h-5" /> },
    { title: 'Settings', href: '/dashboard/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Only redirect if auth is fully resolved and user is not authenticated
    if (!isLoading && !isAuthenticated && !user) {
      // Add a small delay to prevent race conditions
      setTimeout(() => {
        router.push('/login');
      }, 100);
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated - but prevent flickering
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navItems = roleNavItems[user?.role] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-primary">Nurox</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {(user.name || 'User').charAt(0)}
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <p className="text-sm font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all",
        isSidebarOpen ? "lg:ml-64" : ""
      )}>
        {/* Header */}
        <header className="bg-white border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex-1" />

            <NotificationsMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 