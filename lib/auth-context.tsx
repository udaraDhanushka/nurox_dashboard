"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiService } from './api';
import { socketService } from './socket';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Add name property for UI display
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
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const isAuthenticated = !!user;

  const initializeSocket = useCallback((token: string) => {
    try {
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

      // Cleanup function
      return () => {
        clearInterval(pingInterval);
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  }, []);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setIsLoading(false);
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
            
            // Try to get current user from server to ensure token is valid
            const response = await apiService.getCurrentUser();
            
            if (response.success && response.data) {
              setUser(response.data as User);
              
              // Initialize socket connection safely
              try {
                initializeSocket(token);
              } catch (socketError) {
                console.warn('Socket initialization failed:', socketError);
                // Continue without socket - not critical for basic functionality
              }
            } else {
              // Token is invalid, clear stored data
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            // Clear corrupted data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data safely
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        } catch (storageError) {
          console.error('Error clearing localStorage:', storageError);
        }
      } finally {
        // Add a small delay to prevent flickering
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoading(false);
      }
    };

    initAuth();
  }, [initializeSocket]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        setUser((response.data as any).user);
        
        // Initialize socket connection
        initializeSocket((response.data as any).accessToken);
        
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Disconnect socket first
      socketService.disconnect();
      setIsSocketConnected(false);
      
      // Call logout API
      await apiService.logout();
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
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
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    refreshUser,
    isSocketConnected
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;