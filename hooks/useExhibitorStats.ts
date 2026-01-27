import { useState, useEffect } from 'react';
import { exhibitorsAPI, ExhibitorStats } from '@/lib/api/exhibitors';

interface UseExhibitorStatsReturn {
  stats: ExhibitorStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useExhibitorStats = (): UseExhibitorStatsReturn => {
  const [stats, setStats] = useState<ExhibitorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await exhibitorsAPI.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load exhibitor statistics');
      console.error('Exhibitor stats error:', err);
      
      // Fallback to mock data if API fails (for development)
      if (process.env.NODE_ENV === 'development') {
        const mockStats: ExhibitorStats = {
          total: 150,
          byStatus: [
            { _id: 'active', count: 120 },
            { _id: 'pending', count: 30 },
            { _id: 'approved', count: 100 },
            { _id: 'rejected', count: 20 },
            { _id: 'inactive', count: 0 }
          ],
          bySector: [
            { _id: 'Technology', count: 45 },
            { _id: 'Manufacturing', count: 35 },
            { _id: 'Logistics', count: 25 },
            { _id: 'Services', count: 20 },
            { _id: 'Rail', count: 15 },
            { _id: 'Maritime', count: 10 }
          ]
        };
        setStats(mockStats);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};