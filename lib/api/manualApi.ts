// src/lib/api/manualApi.ts

export interface Manual {
  id: string;
  title: string;
  description: string;
  category: string;
  version: string;
  file_path: string;
  file_name: string;
  file_size: string;
  mime_type: string;
  last_updated: string;
  updated_by: string;
  downloads: number;
  status: 'published' | 'draft';
  metadata?: any;
  type?: 'pdf' | 'section'; // To distinguish between PDF and text sections
}

export interface ManualFilters {
  category?: string;
  search?: string;
  status?: string;
}

export interface ManualStatistics {
  totalManuals: number;
  publishedManuals: number;
  draftManuals: number;
  totalDownloads: number;
  categoryStats: Array<{ category: string; count: number }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ManualApi {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://diemex-backend.onrender.com';
  }

  // Get all manuals (combines text sections and PDFs)
  async getManuals(filters?: ManualFilters): Promise<ApiResponse<Manual[]>> {
    try {
      let url = `${this.baseURL}/api/manuals/admin/all`;
      
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.status) {
        params.append('status', filters.status);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { success: true, data: [] };
        }
        throw new ApiError(response.status, await response.text());
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching manuals:', error);
      return { success: true, data: [] };
    }
  }

  // Get statistics
  async getStatistics(): Promise<ApiResponse<ManualStatistics>> {
    try {
      const response = await fetch(`${this.baseURL}/api/manuals/admin/statistics`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: true,
            data: {
              totalManuals: 0,
              publishedManuals: 0,
              draftManuals: 0,
              totalDownloads: 0,
              categoryStats: []
            }
          };
        }
        throw new ApiError(response.status, await response.text());
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        success: true,
        data: {
          totalManuals: 0,
          publishedManuals: 0,
          draftManuals: 0,
          totalDownloads: 0,
          categoryStats: []
        }
      };
    }
  }

  // Create manual (for PDF uploads)
  async createManual(formData: FormData): Promise<ApiResponse<Manual>> {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    
    const response = await fetch(`${this.baseURL}/api/manuals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'Failed to create manual');
    }

    return response.json();
  }

  // Create text section
  async createSection(data: { title: string; content: string; category: string }): Promise<ApiResponse<Manual>> {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    
    const response = await fetch(`${this.baseURL}/api/manuals/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'Failed to create section');
    }

    return response.json();
  }

  // Update manual
  async updateManual(id: string, formData: FormData): Promise<ApiResponse<Manual>> {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    
    const response = await fetch(`${this.baseURL}/api/manuals/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'Failed to update manual');
    }

    return response.json();
  }

  // Delete manual
  async deleteManual(id: string): Promise<ApiResponse<null>> {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    
    const response = await fetch(`${this.baseURL}/api/manuals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'Failed to delete manual');
    }

    return response.json();
  }

  // Delete section
  async deleteSection(id: string): Promise<ApiResponse<null>> {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    
    const response = await fetch(`${this.baseURL}/api/manuals/sections/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(response.status, error.message || 'Failed to delete section');
    }

    return response.json();
  }

  // Download manual
  async downloadManual(id: string): Promise<{ success: boolean; downloadUrl?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/manuals/${id}/download`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download');
      }

      const data = await response.json();
      
      if (data.success && data.data?.downloadUrl) {
        window.open(data.data.downloadUrl, '_blank');
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Error downloading manual:', error);
      return { success: false };
    }
  }

  // Preview manual
  async previewManual(id: string): Promise<void> {
    window.open(`${this.baseURL}/api/manuals/${id}/preview`, '_blank');
  }
}

const manualApi = new ManualApi();
export default manualApi;