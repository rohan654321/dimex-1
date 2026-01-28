import { Exhibitor } from "./api/exhibitors";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('exhibitor_token');
  }
  return null;
};

// Get exhibitor data from localStorage
export const getExhibitorData = (): Exhibitor | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('exhibitor_data');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Logout function
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('exhibitor_token');
    localStorage.removeItem('exhibitor_data');
    window.location.href = '/login';
  }
};

// Make authenticated API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    logout();
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

// Update profile
export const updateProfile = async (data: any) => {
  const response = await fetchWithAuth('/api/auth/exhibitor/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return response.json();
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await fetchWithAuth('/api/auth/exhibitor/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  return response.json();
};

// Get exhibitor profile
export const getProfile = async () => {
  const response = await fetchWithAuth('/api/auth/exhibitor/profile');
  return response.json();
};