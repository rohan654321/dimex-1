import api from '../api';

export interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  borderColor: string;
  borderWidth: number;
  text?: string;
  fontSize: number;
  zIndex: number;
  isLocked?: boolean;
  metadata?: Record<string, any>;
}

export interface FloorPlan {
  id?: string;
  name: string;
  description?: string;
  version: string;
  shapes: Shape[];
  image?: string;
  scale: number;
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  isPublic?: boolean;
  tags?: string[];
  lastModifiedBy?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const floorPlansAPI = {
  // Get all floor plans
  getAll: async (params: any = {}): Promise<ApiResponse<FloorPlan[]>> => {
    const response = await api.get('/floor-plans', { params });
    return response.data;
  },

  // Get single floor plan
  getById: async (id: string): Promise<ApiResponse<FloorPlan>> => {
    const response = await api.get(`/floor-plans/${id}`);
    return response.data;
  },

  // Create floor plan
  create: async (data: Omit<FloorPlan, 'id'>): Promise<ApiResponse<FloorPlan>> => {
    const response = await api.post('/floor-plans', data);
    return response.data;
  },

  // Update floor plan
  update: async (id: string, data: Partial<FloorPlan>): Promise<ApiResponse<FloorPlan>> => {
    const response = await api.put(`/floor-plans/${id}`, data);
    return response.data;
  },

  // Delete floor plan
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/floor-plans/${id}`);
    return response.data;
  },

  // Export floor plan
  export: async (id: string, format: string = 'json'): Promise<ApiResponse> => {
    const response = await api.get(`/floor-plans/${id}/export`, { 
      params: { format }
    });
    return response.data;
  },

  // Duplicate floor plan
  duplicate: async (id: string, newName: string): Promise<ApiResponse<FloorPlan>> => {
    const response = await api.post(`/floor-plans/${id}/duplicate`, { newName });
    return response.data;
  },

  // Upload floor plan image
  uploadImage: async (id: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post(`/floor-plans/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};