import api from '../api';

export interface Exhibitor {
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
  updatedAt?: string;
  stallDetails?: any;
}

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
    _id: string;
    count: number;
  }>;
  bySector: Array<{
    _id: string;
    count: number;
  }>;
}

export interface BulkUpdateRequest {
  ids: string[];
  status: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface GetAllParams {
  search?: string;
  sector?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const exhibitorsAPI = {
  // Get all exhibitors with filters and pagination
  getAll: async (params: GetAllParams = {}): Promise<ExhibitorResponse> => {
    const response = await api.get<ApiResponse<ExhibitorResponse>>('/exhibitors', { params });
    return response.data.data;
  },

  // Get single exhibitor by ID
  getById: async (id: string): Promise<Exhibitor> => {
    const response = await api.get<ApiResponse<Exhibitor>>(`/exhibitors/${id}`);
    return response.data.data;
  },

  // Create a new exhibitor
  create: async (data: Partial<Exhibitor>): Promise<Exhibitor> => {
    const response = await api.post<ApiResponse<Exhibitor>>('/exhibitors', data);
    return response.data.data;
  },

  // Update an exhibitor
  update: async (id: string, data: Partial<Exhibitor>): Promise<Exhibitor> => {
    const response = await api.put<ApiResponse<Exhibitor>>(`/exhibitors/${id}`, data);
    return response.data.data;
  },

  // Delete an exhibitor
  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/exhibitors/${id}`);
  },

  // Get exhibitor statistics
  getStats: async (): Promise<ExhibitorStats> => {
    const response = await api.get<ApiResponse<ExhibitorStats>>('/exhibitors/stats');
    return response.data.data;
  },

  // Bulk update exhibitor status
  bulkUpdateStatus: async (ids: string[], status: string): Promise<void> => {
    await api.post<ApiResponse<void>>('/exhibitors/bulk/update-status', { ids, status });
  },

  // Export exhibitors data
  export: async (format: string = 'csv'): Promise<Blob> => {
    const response = await api.get(`/exhibitors/export/data`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // Additional methods you might need
  getBySector: async (sector: string): Promise<Exhibitor[]> => {
    const response = await api.get<ApiResponse<Exhibitor[]>>(`/exhibitors/sector/${sector}`);
    return response.data.data;
  },

  getByStatus: async (status: string): Promise<Exhibitor[]> => {
    const response = await api.get<ApiResponse<Exhibitor[]>>(`/exhibitors/status/${status}`);
    return response.data.data;
  },

  // Search exhibitors
  search: async (query: string): Promise<Exhibitor[]> => {
    const response = await api.get<ApiResponse<Exhibitor[]>>('/exhibitors/search', {
      params: { q: query }
    });
    return response.data.data;
  },

  // Assign booth to exhibitor
  assignBooth: async (id: string, boothId: string): Promise<Exhibitor> => {
    const response = await api.post<ApiResponse<Exhibitor>>(`/exhibitors/${id}/assign-booth`, { boothId });
    return response.data.data;
  },

  // Get exhibitors by booth
  getByBooth: async (boothId: string): Promise<Exhibitor[]> => {
    const response = await api.get<ApiResponse<Exhibitor[]>>(`/exhibitors/booth/${boothId}`);
    return response.data.data;
  },

  // Send email to exhibitor
  sendEmail: async (id: string, emailData: {
    subject: string;
    body: string;
    template?: string;
  }): Promise<void> => {
    await api.post<ApiResponse<void>>(`/exhibitors/${id}/send-email`, emailData);
  },

  // Bulk send email to multiple exhibitors
  bulkSendEmail: async (ids: string[], emailData: {
    subject: string;
    body: string;
    template?: string;
  }): Promise<void> => {
    await api.post<ApiResponse<void>>('/exhibitors/bulk/send-email', {
      ids,
      ...emailData
    });
  },

  // Upload exhibitor logo
  uploadLogo: async (id: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.post<ApiResponse<{ url: string }>>(
      `/exhibitors/${id}/upload-logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.data;
  },

  // Get exhibitor documents
  getDocuments: async (id: string): Promise<Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>> => {
    const response = await api.get<ApiResponse<any>>(`/exhibitors/${id}/documents`);
    return response.data.data;
  },

  // Upload document for exhibitor
  uploadDocument: async (id: string, file: File, documentType: string): Promise<any> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);
    
    const response = await api.post<ApiResponse<any>>(
      `/exhibitors/${id}/upload-document`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.data;
  },

  // Export exhibitors with custom filters
  exportFiltered: async (filters: GetAllParams, format: string = 'csv'): Promise<Blob> => {
    const response = await api.get('/exhibitors/export/filtered', {
      params: { ...filters, format },
      responseType: 'blob'
    });
    return response.data;
  },

  // Import exhibitors from file
  import: async (file: File): Promise<{
    success: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<any>>(
      '/exhibitors/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.data;
  },

  // Get exhibitor activity log
  getActivityLog: async (id: string): Promise<Array<{
    id: string;
    action: string;
    description: string;
    performedBy: string;
    performedAt: string;
    changes?: any;
  }>> => {
    const response = await api.get<ApiResponse<any>>(`/exhibitors/${id}/activity-log`);
    return response.data.data;
  },

  // Check if exhibitor exists by email
  checkEmailExists: async (email: string): Promise<{ exists: boolean }> => {
    const response = await api.get<ApiResponse<{ exists: boolean }>>('/exhibitors/check-email', {
      params: { email }
    });
    return response.data.data;
  },

  // Check if exhibitor exists by company name
  checkCompanyExists: async (company: string): Promise<{ exists: boolean }> => {
    const response = await api.get<ApiResponse<{ exists: boolean }>>('/exhibitors/check-company', {
      params: { company }
    });
    return response.data.data;
  },

  // Get exhibitor categories/sectors
  getCategories: async (): Promise<Array<{ _id: string; count: number }>> => {
    const response = await api.get<ApiResponse<any>>('/exhibitors/categories');
    return response.data.data;
  },

  // Get exhibitor status options
  getStatusOptions: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/exhibitors/status-options');
    return response.data.data;
  }
};