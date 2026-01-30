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
      
      // Fallback mock data for development
      if (process.env.NODE_ENV === 'development') {
        const mockStats: ExhibitorStats = {
          total: 0,
          byStatus: [
            { _id: 'active', count: 0 },
            { _id: 'pending', count: 0 },
            { _id: 'approved', count: 0 },
            { _id: 'rejected', count: 0 },
            { _id: 'inactive', count: 0 }
          ],
          bySector: []
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