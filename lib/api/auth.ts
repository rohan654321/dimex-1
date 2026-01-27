import api from '../api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const authAPI = {
  // Admin login
  login: async (email: string, password: string): Promise<ApiResponse<AuthData>> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please check your credentials.'
      };
    }
  },

  // Admin logout
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: any) {
      console.error('Logout API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Logout failed'
      };
    }
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error: any) {
      console.error('Refresh token API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to refresh token'
      };
    }
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get('/users/profile/me');
      return response.data;
    } catch (error: any) {
      console.error('Get profile API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get profile'
      };
    }
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await api.put('/users/profile/me', data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile'
      };
    }
  },

  // Test API connection
  testConnection: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error: any) {
      console.error('Test connection error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'API connection failed'
      };
    }
  },

  // Test users API
  testUsersAPI: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/users/test');
      return response.data;
    } catch (error: any) {
      console.error('Test users API error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Users API connection failed'
      };
    }
  }
};