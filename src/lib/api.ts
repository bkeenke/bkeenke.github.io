import apiClient from './api-client';
import type { User, Service, ServiceOrder, PaySystem, AuthResponse } from '@/types';

// Auth API
export const authApi = {
  // Telegram WebApp auth
  telegramAuth: async (initData: string): Promise<AuthResponse> => {
    return apiClient.get<AuthResponse>(`/telegram/webapp/auth?initData=${encodeURIComponent(initData)}`);
  },

  // Login/password auth
  login: async (login: string, password: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/user/auth', { login, password });
  },

  // Check if registration is available
  canRegister: async (): Promise<boolean> => {
    try {
      // Try to access registration endpoint
      await apiClient.get('/user');
      return true;
    } catch {
      return false;
    }
  },
};

// User API
export const userApi = {
  // Get current user info
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/user');
  },

  // Register new user
  register: async (login: string, password: string): Promise<User> => {
    return apiClient.put<User>('/user', { login, password });
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiClient.post<User>('/user', data);
  },
};

// Services API
export const servicesApi = {
  // Get available services for order
  getAvailableServices: async (): Promise<ServiceOrder[]> => {
    return apiClient.get<ServiceOrder[]>('/service/order');
  },

  // Get specific service info
  getServiceInfo: async (serviceId: number): Promise<ServiceOrder> => {
    return apiClient.get<ServiceOrder>(`/service/order/${serviceId}`);
  },

  // Order a service
  orderService: async (serviceId: number, settings?: Record<string, unknown>): Promise<Service> => {
    return apiClient.put<Service>('/service/order', { service_id: serviceId, settings });
  },

  // Get user's active services
  getUserServices: async (): Promise<Service[]> => {
    return apiClient.get<Service[]>('/user/service');
  },

  // Get specific user service
  getUserService: async (userServiceId: number): Promise<Service> => {
    return apiClient.get<Service>(`/user/service/${userServiceId}`);
  },
};

// Payment API
export const paymentApi = {
  // Get available payment systems
  getPaySystems: async (): Promise<PaySystem[]> => {
    return apiClient.get<PaySystem[]>('/user/pay/paysystems');
  },

  // Create payment
  createPayment: async (amount: number, paySystemId: number): Promise<{ redirect_url: string }> => {
    return apiClient.put<{ redirect_url: string }>('/user/pay', { 
      amount, 
      paysystem_id: paySystemId 
    });
  },
};

export { apiClient };
