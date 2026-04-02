// lib/api/dashboard.ts - UPDATED VERSION
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
    pending: number;
    approved: number;
    rejected: number;
    inactive: number;
    recent?: any[];
  };
  visitors?: {
    total: number;
    today: number;
    week: number;
    source?: string;
  };
  revenue?: {
    totalRevenue: number;
    monthRevenue: number;
    pendingAmount: number;
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

export const dashboardAPI = {
  // Get real exhibitor stats from your backend
  getExhibitorStats: async () => {
    try {
      const response = await api.get('/api/exhibitor-stats/count');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching exhibitor stats:', error);
      // Fallback to mock data if API fails
      return {
        success: true,
        data: {
          total: 1,
          active: 1,
          pending: 0,
          approved: 0,
          rejected: 0,
          inactive: 0,
          recent: []
        }
      };
    }
  },

  // Get real visitor stats
  getVisitorStats: async () => {
    try {
      const response = await api.get('/api/exhibitor-stats/visitor-count');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching visitor stats:', error);
      return {
        success: true,
        data: {
          total: 0,
          today: 0,
          thisWeek: 0,
          source: 'none'
        }
      };
    }
  },

  // Mock dashboard summary (fallback)
  getMockSummary: async (): Promise<{ success: boolean; data?: DashboardSummary }> => {
    // Get real counts from API first
    const [exhibitorRes, visitorRes] = await Promise.all([
      dashboardAPI.getExhibitorStats(),
      dashboardAPI.getVisitorStats()
    ]);
    
    return {
      success: true,
      data: {
        users: {
          total: 1,
          active: 1
        },
        exhibitors: {
          total: exhibitorRes.data?.total || 0,
          active: exhibitorRes.data?.active || 0,
          pending: exhibitorRes.data?.pending || 0,
          approved: exhibitorRes.data?.approved || 0,
          rejected: exhibitorRes.data?.rejected || 0,
          inactive: exhibitorRes.data?.inactive || 0
        },
        visitors: {
          total: visitorRes.data?.total || 0,
          today: visitorRes.data?.today || 0,
          week: visitorRes.data?.thisWeek || 0,
          source: visitorRes.data?.source || 'database'
        },
        revenue: {
          totalRevenue: 0,
          monthRevenue: 0,
          pendingAmount: 0
        },
        articles: {
          total: 0,
          published: 0,
          recent: []
        },
        activities: [
          {
            id: 1,
            action: 'System running',
            user: 'System',
            time: new Date().toISOString()
          }
        ]
      }
    };
  },

  // Get dashboard summary
  getSummary: async (): Promise<{ success: boolean; data?: DashboardSummary; error?: string }> => {
    try {
      // Try to get from your dashboard endpoint if it exists
      // const response = await api.get('/dashboard/summary');
      // return response.data;
      
      // Use mock with real data for now
      return await dashboardAPI.getMockSummary();
    } catch (error: any) {
      console.error('Dashboard summary error:', error);
      return await dashboardAPI.getMockSummary();
    }
  },

  // Health check
  getHealth: async () => {
    try {
      const healthApi = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000',
        timeout: 5000,
      });
      const response = await healthApi.get('/health');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};