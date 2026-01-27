import { useState, useEffect, useCallback } from 'react';
import { authAPI, User, ApiResponse, AuthData } from '@/lib/api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    }
    
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('admin_user', JSON.stringify(response.data));
        setError(null);
      } else {
        // If token is invalid, clear it
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
        setError(response.error || 'Session expired. Please login again.');
      }
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      // Clear invalid token
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(null);
      setError('Authentication failed. Please login.');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<ApiResponse<AuthData>> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data?.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setError(null);
      } else {
        setError(response.error || 'Login failed');
      }
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirect: boolean = true) => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(null);
      setError(null);
      if (redirect && typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await authAPI.updateProfile(data);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('admin_user', JSON.stringify(response.data));
        setError(null);
      } else {
        setError(response.error || 'Update failed');
      }
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Update failed';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user && !!localStorage.getItem('admin_token'),
    fetchUser
  };
};