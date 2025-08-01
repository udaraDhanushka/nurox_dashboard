'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiService } from './api';
import { socketService } from './socket';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  isActive: boolean;
  hospitalId?: string;
  pharmacyId?: string;
  laboratoryId?: string;
  insuranceId?: string;
  patientProfile?: any;
  doctorProfile?: any;
  pharmacistProfile?: any;
  mltProfile?: any;
  hospital?: any;
  pharmacy?: any;
  laboratory?: any;
  insuranceCompany?: any;
  createdAt: string;
  updatedAt: string;
  defaultRoute?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  isHydrated: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
  isSocketConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const isAuthenticated = !!user;

  const initializeSocket = useCallback((token: string) => {
    try {
      // Add a small delay to prevent blocking authentication flow
      setTimeout(() => {
        socketService.connect(token);

        // Monitor socket connection status
        socketService.on('connect', () => {
          setIsSocketConnected(true);
          console.log('Socket connected');
        });

        socketService.on('disconnect', () => {
          setIsSocketConnected(false);
          console.log('Socket disconnected');
        });

        // Set up ping interval to maintain connection
        const pingInterval = setInterval(() => {
          if (socketService.isConnected()) {
            socketService.ping();
          }
        }, 30000); // Ping every 30 seconds

        // Store cleanup function
        return () => {
          clearInterval(pingInterval);
        };
      }, 500); // 500ms delay
    } catch (error) {
      console.error('Socket initialization error:', error);
      // Don't block authentication for socket errors
    }
  }, []);

  // Handle hydration first
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize authentication state only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const initAuth = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setIsInitializing(false);
          return;
        }

        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            // Parse and validate stored user data
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser || !parsedUser.email || !parsedUser.role) {
              throw new Error('Invalid user data');
            }

            // Set token in API service
            apiService.setToken(token);

            // Set user immediately from stored data to prevent flicker
            setUser(parsedUser as User);

            // Verify token with server in background
            try {
              const response = await apiService.getCurrentUser();

              if (!response.success) {
                // Token is invalid, clear stored data
                console.log('Invalid token detected, clearing authentication data');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                // Also clear cookie
                document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                setUser(null);
              } else {
                // Initialize socket connection safely
                try {
                  initializeSocket(token);
                } catch (socketError) {
                  console.warn('Socket initialization failed:', socketError);
                  // Continue without socket - not critical for basic functionality
                }
              }
            } catch (apiError) {
              console.warn('API verification failed, but keeping user logged in:', apiError);
              // Don't logout user if API is temporarily unavailable
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            // Clear corrupted data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Also clear cookie
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data safely
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // Also clear cookie
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } catch (storageError) {
          console.error('Error clearing localStorage:', storageError);
        }
      } finally {
        // Very short delay to prevent hydration issues
        await new Promise(resolve => setTimeout(resolve, 50));
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [isHydrated, initializeSocket]);

  const login = async (email: string, password: string) => {
    try {
      // Don't set global isLoading during login - it causes flickering
      const response = await apiService.login(email, password);

      if (response.success && response.data) {
        setUser((response.data as any).user);

        // Initialize socket connection
        initializeSocket((response.data as any).accessToken);

        return {
          success: true,
          message: response.message || 'Login successful',
        };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (userData: any) => {
    try {
      // Don't set global isLoading during register - it causes flickering
      const response = await apiService.register(userData);

      if (response.success && response.data) {
        setUser((response.data as any).user);

        // Initialize socket connection
        initializeSocket((response.data as any).accessToken);

        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      // Disconnect socket first
      socketService.disconnect();
      setIsSocketConnected(false);

      // Call logout API
      await apiService.logout();

      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);

      // Even if API call fails, still clear local state
      socketService.disconnect();
      setIsSocketConnected(false);
      setUser(null);
    } finally {
      // Always clear tokens and stored data regardless of API response
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // Also clear cookie
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      } catch (storageError) {
        console.error('Error clearing storage during logout:', storageError);
      }

      // Clear API service token
      apiService.clearToken();
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();

      if (response.success && response.data) {
        setUser(response.data as User);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading: !isHydrated || isInitializing, // Show loading until hydrated and initialized
    isInitializing,
    isHydrated,
    isAuthenticated,
    login,
    logout,
    register,
    refreshUser,
    isSocketConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
