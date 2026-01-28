import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
    
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('exhibitor_token');
      localStorage.removeItem('exhibitor_data');
    }
    
    return Promise.reject(error);
  }
);

export type ExhibitorStatus = "pending" | "active" | "inactive" | "approved" | "rejected";

export interface Exhibitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  booth: string;
  status: ExhibitorStatus;
  originalPassword?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExhibitorStats {
  total: number;
  byStatus: Array<{ _id: string; count: number }>;
  bySector: Array<{ _id: string; count: number }>;
}

export interface CreateExhibitorData {
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  boothNumber: string;
  password: string;
  status?: ExhibitorStatus;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Helper function to test server connection
export const testServerConnection = async () => {
  try {
    const response = await axios.get('http://localhost:5000/health', {
      timeout: 5000
    });
    console.log('✅ Server connection test:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Server connection failed:', error.message);
    return { 
      success: false, 
      error: `Cannot connect to server at http://localhost:5000. Please ensure backend is running.`
    };
  }
};

// Test login endpoint
export const testLoginEndpoint = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/exhibitor/login', {
      email: 'test@example.com',
      password: 'test123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    console.log('✅ Login endpoint test:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Login endpoint test failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const exhibitorsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sector?: string;
    status?: string;
  }): Promise<PaginatedResponse<Exhibitor>> => {
    try {
      const response = await api.get<PaginatedResponse<Exhibitor>>("/exhibitors", { params });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch exhibitors');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching exhibitors:', error);
      throw error;
    }
  },

  getStats: async (): Promise<ExhibitorStats> => {
    try {
      const response = await api.get<ApiResponse<ExhibitorStats>>("/exhibitors/stats");
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch exhibitor statistics');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching exhibitor stats:', error);
      throw error;
    }
  },

  create: async (data: CreateExhibitorData): Promise<Exhibitor & { originalPassword: string }> => {
    try {
      const response = await api.post<ApiResponse<Exhibitor & { originalPassword: string }>>("/exhibitors", data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create exhibitor');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating exhibitor:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw error;
    }
  },

update: async (id: string, data: Partial<CreateExhibitorData>): Promise<Exhibitor> => {
    try {
      console.log('🔄 Updating exhibitor:', id, data);
      
      const response = await api.put<ApiResponse<Exhibitor>>(`/exhibitors/${id}`, data);
      
      console.log('✅ Update response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update exhibitor');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error updating exhibitor:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to update exhibitor';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  bulkUpdateStatus: async (ids: string[], status: ExhibitorStatus): Promise<{ affectedCount: number }> => {
    try {
      console.log('🔄 Bulk updating status:', { ids, status });
      
      const response = await api.post<ApiResponse<{ affectedCount: number }>>("/exhibitors/bulk/update-status", {
        ids,
        status
      });
      
      console.log('✅ Bulk update response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update status');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Error bulk updating status:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      throw new Error(error.message || 'Failed to update status');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/exhibitors/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete exhibitor');
      }
    } catch (error: any) {
      console.error('Error deleting exhibitor:', error);
      throw error;
    }
  },


};

export const authAPI = {
  login: async (email: string, password: string): Promise<{ token: string; exhibitor: Exhibitor }> => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // First, test if server is reachable
      const serverTest = await testServerConnection();
      if (!serverTest.success) {
        throw new Error(serverTest.error);
      }
      
      console.log('🔄 Sending login request...');
      
      const response = await api.post('/auth/exhibitor/login', { 
        email, 
        password 
      });
      
      console.log('✅ Login response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Login failed');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('❌ Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 403) {
        errorMessage = 'Account is not active. Please contact administrator.';
      } else if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        errorMessage = 'Cannot connect to server. Please ensure backend is running on http://localhost:5000';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  getProfile: async (): Promise<Exhibitor> => {
    try {
      const response = await api.get<ApiResponse<Exhibitor>>("/auth/exhibitor/profile");
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch profile');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Profile error:', error);
      throw error;
    }
  },

  // Test function
  test: async () => {
    try {
      const response = await api.get('/auth/exhibitor/test');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};