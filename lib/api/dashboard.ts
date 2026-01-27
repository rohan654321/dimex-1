import axios from 'axios';
import api from '../api';

export interface DashboardSummary {
  users?: {
    total: number;
    active: number;
  };
  exhibitors?: {
    total: number;
    active: number;
  };
  revenue?: {
    totalRevenue: number;
    monthRevenue: number;
    pendingAmount: number;
  };
  invoices?: {
    total: number;
    paid: number;
    pending: number;
  };
  articles?: {
    total: number;
    published: number;
    recent: Array<{
      id: number;
      title: string;
      views: number;
      status: string;
    }>;
  };
  activities?: Array<{
    id: number;
    action: string;
    user: string;
    time: string;
  }>;
}

export interface HealthStatus {
  status: string;
  uptime: number;
  environment: string;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const dashboardAPI = {
  // Health check
  health: async (): Promise<ApiResponse<HealthStatus>> => {
    try {
      // Remove /api from baseURL for health check
      const healthApi = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000',
        timeout: 5000,
      });
      
      const response = await healthApi.get('/health');
      return response.data;
    } catch (error: any) {
      console.error('Health check error:', error);
      return {
        success: false,
        error: error.message || 'Failed to check health'
      };
    }
  },

  // Get test endpoint
  testAPI: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error: any) {
      console.error('Test API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'API test failed'
      };
    }
  },

  // Mock dashboard summary (temporary until backend endpoint is created)
  getMockSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    // Mock data until backend dashboard endpoint is ready
    return {
      success: true,
      data: {
        users: {
          total: 1,
          active: 1
        },
        exhibitors: {
          total: 0,
          active: 0
        },
        revenue: {
          totalRevenue: 0,
          monthRevenue: 0,
          pendingAmount: 0
        },
        invoices: {
          total: 0,
          paid: 0,
          pending: 0
        },
        articles: {
          total: 0,
          published: 0,
          recent: []
        },
        activities: [
          {
            id: 1,
            action: 'Login',
            user: 'admin@example.com',
            time: new Date().toISOString()
          }
        ]
      }
    };
  },

  // Get actual dashboard summary (when endpoint is ready)
  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    try {
      // This endpoint doesn't exist yet, so use mock for now
      // const response = await api.get('/dashboard/summary');
      // return response.data;
      
      return await dashboardAPI.getMockSummary();
    } catch (error: any) {
      console.error('Dashboard summary error:', error);
      return await dashboardAPI.getMockSummary();
    }
  }
};