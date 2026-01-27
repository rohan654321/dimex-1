import { useState, useEffect, useCallback } from 'react';
import { exhibitorsAPI } from '@/lib/api/exhibitors';

interface Exhibitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  booth: string;
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  website: string;
  createdAt?: string;
  stallDetails?: any;
}

interface UseExhibitorsOptions {
  search?: string;
  sector?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface UseExhibitorsReturn {
  exhibitors: Exhibitor[];
  total: number;
  isLoading: boolean;
  error: string | null;
  createExhibitor: (data: Partial<Exhibitor>) => Promise<Exhibitor>;
  updateExhibitor: (id: string, data: Partial<Exhibitor>) => Promise<Exhibitor>;
  deleteExhibitor: (id: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: string) => Promise<void>;
  exportExhibitors: (format: string) => Promise<void>;
}

export const useExhibitors = (options: UseExhibitorsOptions = {}): UseExhibitorsReturn => {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExhibitors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        search: options.search,
        sector: options.sector,
        status: options.status,
        page: options.page,
        limit: options.limit
      };
      
      // Remove undefined parameters
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await exhibitorsAPI.getAll(params);
      setExhibitors(response.data || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exhibitors');
      console.error('Fetch exhibitors error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [options.search, options.sector, options.status, options.page, options.limit]);

  useEffect(() => {
    fetchExhibitors();
  }, [fetchExhibitors]);

  const createExhibitor = async (data: Partial<Exhibitor>): Promise<Exhibitor> => {
    try {
      const newExhibitor = await exhibitorsAPI.create(data);
      await fetchExhibitors(); // Refresh the list
      return newExhibitor;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create exhibitor');
    }
  };

  const updateExhibitor = async (id: string, data: Partial<Exhibitor>): Promise<Exhibitor> => {
    try {
      const updatedExhibitor = await exhibitorsAPI.update(id, data);
      await fetchExhibitors(); // Refresh the list
      return updatedExhibitor;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update exhibitor');
    }
  };

  const deleteExhibitor = async (id: string): Promise<void> => {
    try {
      await exhibitorsAPI.delete(id);
      await fetchExhibitors(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete exhibitor');
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: string): Promise<void> => {
    try {
      await exhibitorsAPI.bulkUpdateStatus(ids, status);
      await fetchExhibitors(); // Refresh the list
    } catch (err: any) {
      throw new Error(err.message || 'Failed to bulk update status');
    }
  };

  const exportExhibitors = async (format: string = 'csv'): Promise<void> => {
    try {
      const blob = await exhibitorsAPI.export(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exhibitors_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to export exhibitors');
    }
  };

  return {
    exhibitors,
    total,
    isLoading,
    error,
    createExhibitor,
    updateExhibitor,
    deleteExhibitor,
    bulkUpdateStatus,
    exportExhibitors
  };
};