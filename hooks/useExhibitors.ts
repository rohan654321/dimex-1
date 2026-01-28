import { useState, useEffect, useCallback } from "react";
import { exhibitorsAPI, ExhibitorStatus, Exhibitor, PaginatedResponse } from "@/lib/api/exhibitors";

interface UseExhibitorsOptions {
  search?: string;
  sector?: string;
  status?: ExhibitorStatus | 'all';
  page?: number;
  limit?: number;
}

interface UseExhibitorsReturn {
  exhibitors: Exhibitor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createExhibitor: (data: any) => Promise<Exhibitor & { originalPassword: string }>;
  updateExhibitor: (id: string, data: Partial<Exhibitor>) => Promise<Exhibitor>;
  deleteExhibitor: (id: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: ExhibitorStatus) => Promise<void>;
}

export const useExhibitors = (options: UseExhibitorsOptions = {}): UseExhibitorsReturn => {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);
  const [limit, setLimit] = useState(options.limit || 10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExhibitors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page: options.page || page,
        limit: options.limit || limit,
        search: options.search,
        sector: options.sector,
        status: options.status === 'all' ? '' : options.status,
      };

      const response = await exhibitorsAPI.getAll(params);
      
      setExhibitors(response.data);
      setTotal(response.pagination.total);
      setPage(response.pagination.page);
      setLimit(response.pagination.limit);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch exhibitors");
      console.error("Error fetching exhibitors:", err);
    } finally {
      setIsLoading(false);
    }
  }, [options.search, options.sector, options.status, options.page, options.limit, page, limit]);

  useEffect(() => {
    fetchExhibitors();
  }, [fetchExhibitors]);

  const createExhibitor = async (data: any): Promise<Exhibitor & { originalPassword: string }> => {
    try {
      const result = await exhibitorsAPI.create(data);
      await fetchExhibitors();
      return result;
    } catch (err: any) {
      throw new Error(err.message || "Failed to create exhibitor");
    }
  };

  const updateExhibitor = async (id: string, data: Partial<Exhibitor>): Promise<Exhibitor> => {
    try {
      const result = await exhibitorsAPI.update(id, data);
      await fetchExhibitors();
      return result;
    } catch (err: any) {
      throw new Error(err.message || "Failed to update exhibitor");
    }
  };

  const deleteExhibitor = async (id: string): Promise<void> => {
    try {
      await exhibitorsAPI.delete(id);
      await fetchExhibitors();
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete exhibitor");
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: ExhibitorStatus): Promise<void> => {
    try {
      await exhibitorsAPI.bulkUpdateStatus(ids, status);
      await fetchExhibitors();
    } catch (err: any) {
      throw new Error(err.message || "Failed to update status");
    }
  };

  return {
    exhibitors,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: fetchExhibitors,
    createExhibitor,
    updateExhibitor,
    deleteExhibitor,
    bulkUpdateStatus,
  };
};