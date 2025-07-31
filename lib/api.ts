const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      // Also set as cookie for middleware access
      document.cookie = `accessToken=${token}; path=/; max-age=86400; secure; samesite=strict`;
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Also clear cookie
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  private getMockResponse<T>(endpoint: string): ApiResponse<T> {
    // Generate mock data based on endpoint
    switch (endpoint) {
      case '/organizations/all':
        return {
          success: true,
          message: 'Organizations retrieved successfully',
          data: {
            hospitals: [
              {
                id: '1',
                name: 'General Hospital',
                status: 'ACTIVE',
                createdAt: '2024-01-15T09:00:00Z',
                _count: { users: 45 }
              },
              {
                id: '2',
                name: 'City Medical Center',
                status: 'ACTIVE',
                createdAt: '2024-02-20T10:30:00Z',
                _count: { users: 32 }
              }
            ],
            pharmacies: [
              {
                id: '1',
                name: 'Central Pharmacy',
                status: 'ACTIVE',
                createdAt: '2024-01-10T08:00:00Z',
                _count: { users: 12 }
              },
              {
                id: '2',
                name: 'Health Plus Pharmacy',
                status: 'ACTIVE',
                createdAt: '2024-03-05T14:20:00Z',
                _count: { users: 8 },
                hospitalId: '1'
              }
            ],
            laboratories: [
              {
                id: '1',
                name: 'Diagnostic Lab',
                status: 'ACTIVE',
                createdAt: '2024-01-25T11:00:00Z',
                _count: { users: 18 }
              },
              {
                id: '2',
                name: 'Medical Testing Center',
                status: 'PENDING_APPROVAL',
                createdAt: '2024-03-10T16:45:00Z',
                _count: { users: 5 },
                hospitalId: '2'
              }
            ],
            insuranceCompanies: [
              {
                id: '1',
                name: 'Health Insurance Co.',
                status: 'ACTIVE',
                createdAt: '2024-02-01T09:15:00Z',
                _count: { users: 25 }
              },
              {
                id: '2',
                name: 'MediCare Plus',
                status: 'ACTIVE',
                createdAt: '2024-02-15T13:30:00Z',
                _count: { users: 15 }
              }
            ],
            summary: {
              totalHospitals: 2,
              totalPharmacies: 2,
              totalLaboratories: 2,
              totalInsuranceCompanies: 2
            }
          } as T
        };
      
      case '/analytics/dashboard':
        return {
          success: true,
          message: 'Dashboard stats retrieved successfully',
          data: {
            totalAppointments: 156,
            completedAppointments: 142,
            pendingAppointments: 14,
            totalPrescriptions: 89,
            activePrescriptions: 76,
            completedPrescriptions: 13,
            totalUsers: 248,
            activeUsers: 195,
            newUsers: 12
          } as T
        };
      
      default:
        return {
          success: true,
          message: 'Mock API response',
          data: {} as T
        };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Check if we're using mock authentication
    const isMockAuth = this.token && this.token.startsWith('mock_');
    
    if (isMockAuth) {
      // Return specific mock data based on endpoint
      return this.getMockResponse<T>(endpoint);
    }

    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request with new token
            headers.Authorization = `Bearer ${this.token}`;
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            });
            
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          }
          
          // If refresh failed or retry failed, clear token and redirect to login
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Authentication failed');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          this.setToken(data.data.accessToken);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async login(email: string, password: string) {
    // All accounts now use the API endpoint
    const response = await this.post<{
      user: any;
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
    }>('/auth/login', { email, password });

    if (response.success && response.data) {
      this.setToken((response.data as any).accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', (response.data as any).refreshToken);
        localStorage.setItem('user', JSON.stringify((response.data as any).user));
      }
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    dateOfBirth?: string;
    hospitalId?: string;
    pharmacyId?: string;
    laboratoryId?: string;
    insuranceId?: string;
    specialization?: string;
  }) {
    const response = await this.post('/auth/register', userData);

    if (response.success && response.data) {
      this.setToken((response.data as any).accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', (response.data as any).refreshToken);
        localStorage.setItem('user', JSON.stringify((response.data as any).user));
      }
    }

    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    // Get current user from API
    return this.get('/auth/me');
  }

  // Organization management methods
  async getHospitals(params?: { status?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.get(`/organizations/hospitals${query ? `?${query}` : ''}`);
  }

  async getHospitalById(id: string) {
    return this.get(`/organizations/hospitals/${id}`);
  }

  async createHospital(hospitalData: any) {
    return this.post('/organizations/hospitals', hospitalData);
  }

  async updateHospital(id: string, updateData: any) {
    return this.put(`/organizations/hospitals/${id}`, updateData);
  }

  async deleteHospital(id: string) {
    return this.delete(`/organizations/hospitals/${id}`);
  }

  async getDoctorVerificationRequests(hospitalId: string, status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.get(`/organizations/hospitals/${hospitalId}/doctor-verification-requests${query}`);
  }

  async updateDoctorVerification(hospitalId: string, doctorId: string, data: {
    status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';
    rejectionReason?: string;
  }) {
    return this.put(`/organizations/hospitals/${hospitalId}/doctors/${doctorId}/verification`, data);
  }

  async createPharmacy(pharmacyData: any) {
    return this.post('/organizations/pharmacies', pharmacyData);
  }

  async createLaboratory(labData: any) {
    return this.post('/organizations/laboratories', labData);
  }

  async createInsuranceCompany(insuranceData: any) {
    return this.post('/organizations/insurance-companies', insuranceData);
  }

  async getAllOrganizations() {
    return this.get('/organizations/all');
  }

  // User management methods
  async getUsers(params?: { role?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.get(`/users${query ? `?${query}` : ''}`);
  }

  async getUserById(id: string) {
    return this.get(`/users/${id}`);
  }

  async updateUser(id: string, updateData: any) {
    return this.put(`/users/${id}`, updateData);
  }

  async deactivateUser(id: string) {
    return this.patch(`/users/${id}/deactivate`);
  }

  async activateUser(id: string) {
    return this.patch(`/users/${id}/activate`);
  }

  // Appointment methods
  async getAppointments(params?: { 
    status?: string; 
    doctorId?: string; 
    patientId?: string; 
    date?: string;
    page?: number; 
    limit?: number; 
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
    if (params?.patientId) queryParams.append('patientId', params.patientId);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.get(`/appointments${query ? `?${query}` : ''}`);
  }

  async createAppointment(appointmentData: any) {
    return this.post('/appointments', appointmentData);
  }

  async updateAppointment(id: string, updateData: any) {
    return this.put(`/appointments/${id}`, updateData);
  }

  async cancelAppointment(id: string, reason?: string) {
    return this.patch(`/appointments/${id}/cancel`, { reason });
  }

  // Prescription methods
  async getPrescriptions(params?: { 
    status?: string; 
    doctorId?: string; 
    patientId?: string; 
    pharmacistId?: string;
    page?: number; 
    limit?: number; 
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
    if (params?.patientId) queryParams.append('patientId', params.patientId);
    if (params?.pharmacistId) queryParams.append('pharmacistId', params.pharmacistId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.get(`/prescriptions${query ? `?${query}` : ''}`);
  }

  async createPrescription(prescriptionData: any) {
    return this.post('/prescriptions', prescriptionData);
  }

  async updatePrescription(id: string, updateData: any) {
    return this.put(`/prescriptions/${id}`, updateData);
  }

  // Analytics methods
  async getDashboardStats(role?: string) {
    const query = role ? `?role=${role}` : '';
    return this.get(`/analytics/dashboard${query}`);
  }

  async getAnalytics(type: string, params?: any) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key].toString());
        }
      });
    }
    
    const query = queryParams.toString();
    return this.get(`/analytics/${type}${query ? `?${query}` : ''}`);
  }
}

export const apiService = new ApiService();
export default apiService;