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
import { useAuth } from '@/lib/auth-context';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});


const getRoleDashboardPath = (role: string, defaultRoute?: string | null) => {
  // Use the default route provided by the server if available
  if (defaultRoute) {
    return `/dashboard/${defaultRoute}`;
  }
  
  // If defaultRoute is explicitly null, this role has no dashboard access
  if (defaultRoute === null) {
    return null;
  }
  
  // Fallback mapping for dashboard-accessible roles only
  switch (role) {
    case 'ADMIN':
    case 'SUPER_ADMIN': return '/dashboard/admin';
    case 'HOSPITAL_ADMIN': return '/dashboard/hospital';
    case 'PHARMACY_ADMIN': return '/dashboard/pharmacy';
    case 'LAB_ADMIN': return '/dashboard/lab';
    case 'INSURANCE_ADMIN': return '/dashboard/insurer';
    case 'DOCTOR': return '/dashboard/doctor';
    case 'PHARMACIST': return '/dashboard/pharmacist';
    case 'MLT': return '/dashboard/mlt';
    case 'PATIENT':
    case 'INSURANCE_AGENT':
      return null;
    default: return null;
  }
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { login, logout, isAuthenticated, user, isLoading: authLoading, isHydrated } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle client-side mounting and clear legacy tokens
  useEffect(() => {
    setIsMounted(true);
    
    // Clear any legacy non-JWT tokens on mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && (token.startsWith('access_token_') || !token.includes('.'))) {
        console.log('Clearing legacy token format');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle redirect immediately when user becomes available
  useEffect(() => {
    if (isHydrated && !authLoading && isAuthenticated && user) {
      const dashboardPath = getRoleDashboardPath(user.role, user.defaultRoute);
      
      if (dashboardPath) {
        // Immediate redirect
        router.replace(dashboardPath);
      } else {
        // For mobile-only roles, show access denied message and reset state
        toast.error(`Dashboard access denied. ${user.role === 'PATIENT' ? 'Patients' : 'Insurance Agents'} must use the Nurox Mobile App.`);
        // Force logout for mobile-only roles
        logout();
      }
    }
  }, [isHydrated, authLoading, isAuthenticated, user, router]);

  // Don't render anything until mounted and hydrated
  if (!isMounted || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading during auth initialization
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading during login process
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Signing in...</p>
        </div>
      </div>
    );
  }

  // If authenticated but somehow still here, redirect
  if (isAuthenticated && user) {
    const dashboardPath = getRoleDashboardPath(user.role, user.defaultRoute);
    if (dashboardPath) {
      router.replace(dashboardPath);
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting...</p>
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
      } else {
        toast.error(result.message || 'Login failed');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
      setIsLoading(false);
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
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
      </div>
    </div>
  );
}