'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, LogIn, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

// Demo accounts with dashboard access only (Patients & Insurance Agents use mobile app)
const demoAccounts = [
  { email: 'superadmin@nurox.com', role: 'SUPER_ADMIN', name: 'Super Admin', description: 'Manage all organizations' },
  { email: 'hospitaladmin@nurox.com', role: 'HOSPITAL_ADMIN', name: 'Hospital Admin', description: 'Manage hospital operations' },
  { email: 'pharmacyadmin@nurox.com', role: 'PHARMACY_ADMIN', name: 'Pharmacy Admin', description: 'Manage pharmacy operations' },
  { email: 'labadmin@nurox.com', role: 'LAB_ADMIN', name: 'Lab Admin', description: 'Manage laboratory operations' },
  { email: 'insuranceadmin@nurox.com', role: 'INSURANCE_ADMIN', name: 'Insurance Admin', description: 'Manage insurance operations' },
  { email: 'doctor@nurox.com', role: 'DOCTOR', name: 'Dr. Michael Thompson', description: 'Medical practitioner' },
  { email: 'pharmacist@nurox.com', role: 'PHARMACIST', name: 'PharmD Lisa Chen', description: 'Licensed pharmacist' },
  { email: 'mlt@nurox.com', role: 'MLT', name: 'David Martinez', description: 'Medical lab technician' }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-purple-500';
    case 'HOSPITAL_ADMIN': return 'bg-blue-500';
    case 'PHARMACY_ADMIN': return 'bg-green-500';
    case 'LAB_ADMIN': return 'bg-yellow-500';
    case 'INSURANCE_ADMIN': return 'bg-orange-500';
    case 'DOCTOR': return 'bg-cyan-500';
    case 'PATIENT': return 'bg-pink-500';
    case 'PHARMACIST': return 'bg-emerald-500';
    case 'MLT': return 'bg-indigo-500';
    default: return 'bg-gray-500';
  }
};

const getRoleDashboardPath = (role: string) => {
  // Dashboard access is restricted to admin and healthcare provider roles only
  // Patients and Insurance Agents should use the mobile app
  switch (role) {
    case 'SUPER_ADMIN': return '/dashboard/admin';
    case 'HOSPITAL_ADMIN': return '/dashboard/hospital';
    case 'PHARMACY_ADMIN': return '/dashboard/pharmacy';
    case 'LAB_ADMIN': return '/dashboard/lab';
    case 'INSURANCE_ADMIN': return '/dashboard/insurer';
    case 'DOCTOR': return '/dashboard/doctor';
    case 'PHARMACIST': return '/dashboard/pharmacist';
    case 'MLT': return '/dashboard/mlt';
    // Restricted roles - should use mobile app
    case 'PATIENT': 
    case 'INSURANCE_AGENT':
      return null; // Will trigger access denied
    default: return '/dashboard';
  }
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if already authenticated (but only after auth loading is complete)
  useEffect(() => {
    // Only redirect if fully authenticated and not currently loading
    if (!authLoading && isAuthenticated && user && !isLoading) {
      const dashboardPath = getRoleDashboardPath(user.role);
      if (dashboardPath) {
        // Add a small delay to ensure state is stable
        setTimeout(() => {
          router.push(dashboardPath);
        }, 50);
      } else {
        // For restricted roles (PATIENT, INSURANCE_AGENT), show access denied message
        toast.error(`Access denied. ${user.role === 'PATIENT' ? 'Patients' : 'Insurance Agents'} should use the Nurox Mobile App.`);
        // Logout the user since they can't access dashboard
        // logout(); // Uncomment if logout function is available
      }
    }
  }, [authLoading, isAuthenticated, user, router, isLoading]);

  // Don't render anything until both mounted and auth state is resolved
  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show loading while redirecting
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isMounted) return;
    setIsLoading(true);
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.success) {
        toast.success('Login successful!');
        // Role-based access control will be handled by the useEffect hook above
        // which checks the user from auth context after login
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    form.setValue('email', account.email);
    form.setValue('password', 'admin123456');
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Nurox Dashboard</CardTitle>
              </div>
              <CardDescription>
                Sign in to your account to access the healthcare management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email address" 
                            type="email"
                            autoComplete="email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="current-password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  Contact your administrator
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Demo Accounts */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Demo Accounts</CardTitle>
              <CardDescription>
                Click on any account below to auto-fill the login form. All accounts use the password: <strong>admin123456</strong>
                <br /><br />
                <em>Note: Patients and Insurance Agents should use the Nurox Mobile App.</em>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoAccounts.map((account) => (
                  <div
                    key={account.email}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDemoLogin(account)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${getRoleColor(account.role)} text-white`}>
                          {account.role.replace('_', ' ')}
                        </Badge>
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{account.email}</p>
                      <p className="text-xs text-muted-foreground">{account.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Use Account
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}