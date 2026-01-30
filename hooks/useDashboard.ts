import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api/dashboard';

interface DashboardSummary {
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

interface HealthStatus {
  status: string;
  uptime: number;
  environment: string;
  timestamp: string;
}

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [summaryRes, healthRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.health()
      ]);
      
      if (summaryRes.data) {
        setSummary(summaryRes.data);
      }
      
      if (healthRes.data) {
        setHealth(healthRes.data);
      }
      
      if (summaryRes.error) {
        setError(summaryRes.error);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refetch = async () => {
    await fetchDashboardData();
  };

  return {
    summary,
    health,
    isLoading,
    error,
    refetch
  };
};