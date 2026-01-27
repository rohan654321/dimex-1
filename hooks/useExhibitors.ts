// hooks/useExhibitors.ts
import { useState, useEffect, useCallback } from "react";
import {
  exhibitorsAPI,
  ExhibitorStatus,
  Exhibitor,
} from "@/lib/api/exhibitors";

/* =======================
   OPTIONS TYPE
======================= */
interface UseExhibitorsOptions {
  search?: string;
  sector?: string;
  status?: ExhibitorStatus;
  page?: number;
  limit?: number;
}

/* =======================
   RETURN TYPE
======================= */
interface UseExhibitorsReturn {
  exhibitors: Exhibitor[];
  total: number;
  isLoading: boolean;
  error: string | null;
  createExhibitor: (data: Partial<Exhibitor>) => Promise<Exhibitor>;
  updateExhibitor: (id: string, data: Partial<Exhibitor>) => Promise<Exhibitor>;
  deleteExhibitor: (id: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: ExhibitorStatus) => Promise<void>;
  exportExhibitors: (format?: "csv" | "excel") => Promise<void>;
}

/* =======================
   HOOK
======================= */
export const useExhibitors = (
  options: UseExhibitorsOptions = {}
): UseExhibitorsReturn => {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -------- FETCH -------- */
  const fetchExhibitors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: UseExhibitorsOptions = {
        search: options.search,
        sector: options.sector,
        status: options.status,
        page: options.page,
        limit: options.limit,
      };

      // Remove undefined values safely
      Object.keys(params).forEach((key) => {
        if (params[key as keyof UseExhibitorsOptions] === undefined) {
          delete params[key as keyof UseExhibitorsOptions];
        }
      });

      const response = await exhibitorsAPI.getAll(params, true);

      setExhibitors(response.data ?? []);
      setTotal(response.total ?? 0);
    } catch (err: any) {
      console.error("❌ Fetch exhibitors error:", err);
      setError(err.message || "Failed to fetch exhibitors");
    } finally {
      setIsLoading(false);
    }
  }, [
    options.search,
    options.sector,
    options.status,
    options.page,
    options.limit,
  ]);

  useEffect(() => {
    fetchExhibitors();
  }, [fetchExhibitors]);

  /* -------- CREATE -------- */
  const createExhibitor = async (
    data: Partial<Exhibitor>
  ): Promise<Exhibitor> => {
    const exhibitor = await exhibitorsAPI.create(data);
    await fetchExhibitors();
    return exhibitor;
  };

  /* -------- UPDATE -------- */
  const updateExhibitor = async (
    id: string,
    data: Partial<Exhibitor>
  ): Promise<Exhibitor> => {
    const exhibitor = await exhibitorsAPI.update(id, data);
    await fetchExhibitors();
    return exhibitor;
  };

  /* -------- DELETE -------- */
  const deleteExhibitor = async (id: string): Promise<void> => {
    await exhibitorsAPI.delete(id);
    await fetchExhibitors();
  };

  /* -------- BULK STATUS UPDATE -------- */
  const bulkUpdateStatus = async (
    ids: string[],
    status: ExhibitorStatus
  ): Promise<void> => {
    await exhibitorsAPI.bulkUpdateStatus(ids, status);
    await fetchExhibitors();
  };

  /* -------- EXPORT -------- */
  const exportExhibitors = async (
    format: "csv" | "excel" = "csv"
  ): Promise<void> => {
    const blob = await exhibitorsAPI.export(format);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exhibitors_${new Date()
      .toISOString()
      .split("T")[0]}.${format}`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
    exportExhibitors,
  };
};
