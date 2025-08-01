'use client';

import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Check if we're using mock authentication
    const isMockAuth = token && token.startsWith('mock_');

    if (isMockAuth) {
      // Create a mock socket for demo mode
      this.socket = {
        connected: true,
        connect: () => {},
        disconnect: () => {},
        on: (event: string, callback: Function) => {
          // Simulate connection event
          if (event === 'connect') {
            setTimeout(() => callback(), 100);
          }
        },
        onAny: () => {},
        emit: () => {},
      } as any;

      // Simulate successful connection
      setTimeout(() => {
        if (this.socket) {
          const eventListeners = this.listeners.get('connect');
          if (eventListeners) {
            eventListeners.forEach(listener => listener());
          }
        }
      }, 100);

      return this.socket;
    }

    const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

    this.socket = io(socketURL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', reason => {
      console.log('Disconnected from server:', reason);

      // Auto-reconnect on network issues
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't auto-reconnect
        return;
      }

      // Client side issue, auto-reconnect
      setTimeout(() => {
        if (this.socket && !this.socket.connected) {
          this.socket.connect();
        }
      }, 1000);
    });

    this.socket.on('connect_error', error => {
      console.error('Connection error:', error);

      if (
        error.message === 'Authentication failed' ||
        error.message === 'Authentication token required' ||
        error.message === 'Invalid or expired token'
      ) {
        // Authentication error, redirect to login
        this.disconnect();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    });

    // Set up event relay system
    this.socket.onAny((eventName: string, ...args: any[]) => {
      const eventListeners = this.listeners.get(eventName);
      if (eventListeners) {
        eventListeners.forEach(listener => {
          try {
            listener(...args);
          } catch (error) {
            console.error(`Error in event listener for ${eventName}:`, error);
          }
        });
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Event listeners
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }

    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  // Specific event handlers for the dashboard
  onAppointmentUpdate(callback: (data: any) => void) {
    this.on('appointment:updated', callback);
  }

  onPrescriptionUpdate(callback: (data: any) => void) {
    this.on('prescription:updated', callback);
  }

  onDoctorVerificationUpdate(callback: (data: any) => void) {
    this.on('verification:updated', callback);
  }

  onHospitalUpdate(callback: (data: any) => void) {
    this.on('hospital:appointment:updated', callback);
    this.on('hospital:doctor:verification', callback);
  }

  onLabResultUpdate(callback: (data: any) => void) {
    this.on('lab-result:updated', callback);
    this.on('lab:result:updated', callback);
  }

  onSystemAlert(callback: (data: any) => void) {
    this.on('system:alert', callback);
  }

  onNewOrganization(callback: (data: any) => void) {
    this.on('admin:organization:new', callback);
  }

  onAdminNotification(callback: (data: any) => void) {
    this.on('admin:doctor:verification', callback);
    this.on('admin:organization:new', callback);
  }

  // Send ping to check connection
  ping() {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  // Handle pong response
  onPong(callback: () => void) {
    this.on('pong', callback);
  }
}

export const socketService = new SocketService();
export default socketService;
