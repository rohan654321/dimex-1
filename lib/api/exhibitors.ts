import api from "../api";

/* =======================
   STATUS TYPE (SINGLE SOURCE OF TRUTH)
======================= */
export type ExhibitorStatus =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected";

/* =======================
   MAIN EXHIBITOR TYPE
======================= */
export interface Exhibitor {
  [x: string]: any;
  plainPassword: any;
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  booth: string;
  status: ExhibitorStatus;
  registrationDate: string;
  website: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  stallDetails?: any;
}

/* =======================
   API RESPONSE TYPES
======================= */
export interface ExhibitorResponse {
  data: Exhibitor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExhibitorStats {
  total: number;
  byStatus: Array<{
    _id: ExhibitorStatus;
    count: number;
  }>;
  bySector: Array<{
    _id: string;
    count: number;
  }>;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/* =======================
   QUERY PARAM TYPES
======================= */
interface GetAllParams {
  search?: string;
  sector?: string;
  status?: ExhibitorStatus;
  page?: number;
  limit?: number;
}

/* =======================
   API IMPLEMENTATION
======================= */
export const exhibitorsAPI = {
  /* -------- GET ALL -------- */
  getAll: async (
    params: GetAllParams = {},
    includePassword: boolean = false
  ): Promise<ExhibitorResponse> => {
    const response = await api.get<ApiResponse<any>>("/exhibitors", {
      params: {
        ...params,
        includePassword: includePassword ? "true" : "false",
      },
    });

    const apiData = response.data.data;

    let exhibitors: Exhibitor[] = [];
    let total = 0;
    let page = 1;
    let limit = 10;
    let totalPages = 0;

    if (apiData) {
      if (Array.isArray(apiData.data)) {
        exhibitors = apiData.data;
        total = apiData.total || 0;
        page = apiData.page || 1;
        limit = apiData.limit || 10;
        totalPages = apiData.totalPages || 0;
      } else if (Array.isArray(apiData.exhibitors)) {
        exhibitors = apiData.exhibitors;
        total = apiData.total || 0;
        page = apiData.page || 1;
        limit = apiData.limit || 10;
        totalPages = apiData.totalPages || 0;
      } else if (Array.isArray(apiData)) {
        exhibitors = apiData;
        total = apiData.length;
      }
    }

    return {
      data: exhibitors,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /* -------- GET BY ID -------- */
  getById: async (id: string): Promise<Exhibitor> => {
    const response = await api.get<ApiResponse<Exhibitor>>(`/exhibitors/${id}`);
    return response.data.data;
  },

  /* -------- CREATE -------- */
  create: async (data: Partial<Exhibitor>): Promise<Exhibitor> => {
    const response = await api.post<ApiResponse<Exhibitor>>(
      "/exhibitors",
      data
    );
    return response.data.data;
  },

  /* -------- UPDATE -------- */
  update: async (
    id: string,
    data: Partial<Exhibitor>
  ): Promise<Exhibitor> => {
    const response = await api.put<ApiResponse<Exhibitor>>(
      `/exhibitors/${id}`,
      data
    );
    return response.data.data;
  },

  /* -------- DELETE -------- */
  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/exhibitors/${id}`);
  },

  /* -------- STATS -------- */
  getStats: async (): Promise<ExhibitorStats> => {
    const response = await api.get<ApiResponse<ExhibitorStats>>(
      "/exhibitors/stats"
    );
    return response.data.data;
  },

  /* -------- BULK STATUS UPDATE -------- */
  bulkUpdateStatus: async (
    ids: string[],
    status: ExhibitorStatus
  ): Promise<void> => {
    await api.post<ApiResponse<void>>(
      "/exhibitors/bulk/update-status",
      { ids, status }
    );
  },

  /* -------- EXPORT -------- */
  export: async (format: "csv" | "excel" = "csv"): Promise<Blob> => {
    const response = await api.get("/exhibitors/export/data", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },

  /* -------- FILTER HELPERS -------- */
  getBySector: async (sector: string): Promise<Exhibitor[]> => {
    const response = await api.get<ApiResponse<Exhibitor[]>>(
      `/exhibitors/sector/${sector}`
    );
    return response.data.data;
  },

  getByStatus: async (status: ExhibitorStatus): Promise<Exhibitor[]> => {
    const response = await api.get<ApiResponse<Exhibitor[]>>(
      `/exhibitors/status/${status}`
    );
    return response.data.data;
  },

  /* -------- ASSIGN BOOTH -------- */
  assignBooth: async (
    id: string,
    boothId: string
  ): Promise<Exhibitor> => {
    const response = await api.post<ApiResponse<Exhibitor>>(
      `/exhibitors/${id}/assign-booth`,
      { boothId }
    );
    return response.data.data;
  },

  /* -------- STATUS OPTIONS -------- */
  getStatusOptions: async (): Promise<ExhibitorStatus[]> => {
    const response = await api.get<ApiResponse<ExhibitorStatus[]>>(
      "/exhibitors/status-options"
    );
    return response.data.data;
  },
};
