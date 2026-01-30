import api from '../api';
import { Shape, ShapeType, FloorPlan as FloorPlanType } from '@/lib/types';

// Helper to handle API errors
const handleApiError = (error: any, defaultMessage: string): ApiResponse => {
  console.error('API Error:', error);
  
  let errorMessage = defaultMessage;
  
  if (error.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return {
    success: false,
    error: errorMessage
  };
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

export const floorPlansAPI = {
  // Test API connection
  testConnection: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/floor-plans/test');
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to connect to floor plans API');
    }
  },

  getAll: async (params: any = {}): Promise<ApiResponse<FloorPlanType[]>> => {
    try {
      console.log('📋 Fetching floor plans with params:', params);
      const response = await api.get('/floor-plans', { params });
      console.log('📊 Full API Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data,
        config: response.config
      });
      
      // Transform the response to match FloorPlanType
      if (response.data?.data) {
        const transformedData = response.data.data.map((plan: any): FloorPlanType => ({
          id: String(plan.id),
          name: plan.name || '',
          description: plan.description || '',
          version: plan.version || "1.0",
          shapes: Array.isArray(plan.shapes) ? plan.shapes.map((shape: any): Shape => ({
            id: shape.id || `shape-${Date.now()}-${Math.random()}`,
            type: (shape.type as ShapeType) || 'rectangle',
            x: Number(shape.x) || 0,
            y: Number(shape.y) || 0,
            width: Number(shape.width) || 50,
            height: Number(shape.height) || 50,
            rotation: Number(shape.rotation) || 0,
            color: shape.color || "rgba(59, 130, 246, 0.3)",
            borderColor: shape.borderColor || "#1e40af",
            borderWidth: Number(shape.borderWidth) || 2,
            fontSize: Number(shape.fontSize) || 12,
            text: shape.text || '',
            zIndex: Number(shape.zIndex) || 1,
            isLocked: Boolean(shape.isLocked),
            metadata: shape.metadata || {}
          })) : [],
          image: plan.image || undefined,
          scale: Number(plan.scale) || 0.1,
          tags: plan.tags || [],
          isPublic: Boolean(plan.isPublic),
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          thumbnail: plan.thumbnail
        }));
        
        return {
          success: true,
          data: transformedData,
          total: response.data.pagination?.total,
          page: response.data.pagination?.page,
          totalPages: response.data.pagination?.pages
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ API Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      return handleApiError(error, 'Failed to fetch floor plans');
    }
  },

  // Get single floor plan
  getById: async (id: string | number): Promise<ApiResponse<FloorPlanType>> => {
    try {
      const response = await api.get(`/floor-plans/${id}`);
      
      // Transform the response
      const plan = response.data?.data;
      if (plan) {
        const transformedPlan: FloorPlanType = {
          id: String(plan.id),
          name: plan.name || '',
          description: plan.description || '',
          version: plan.version || "1.0",
          shapes: Array.isArray(plan.shapes) ? plan.shapes.map((shape: any): Shape => ({
            id: shape.id || `shape-${Date.now()}-${Math.random()}`,
            type: (shape.type as ShapeType) || 'rectangle',
            x: Number(shape.x) || 0,
            y: Number(shape.y) || 0,
            width: Number(shape.width) || 50,
            height: Number(shape.height) || 50,
            rotation: Number(shape.rotation) || 0,
            color: shape.color || "rgba(59, 130, 246, 0.3)",
            borderColor: shape.borderColor || "#1e40af",
            borderWidth: Number(shape.borderWidth) || 2,
            fontSize: Number(shape.fontSize) || 12,
            text: shape.text || '',
            zIndex: Number(shape.zIndex) || 1,
            isLocked: Boolean(shape.isLocked),
            metadata: shape.metadata || {}
          })) : [],
          image: plan.image || undefined,
          scale: Number(plan.scale) || 0.1,
          tags: plan.tags || [],
          isPublic: Boolean(plan.isPublic),
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          thumbnail: plan.thumbnail
        };
        
        return {
          success: true,
          data: transformedPlan
        };
      }
      
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Floor plan not found');
    }
  },

  // Create floor plan
  create: async (data: Omit<FloorPlanType, 'id'>): Promise<ApiResponse<FloorPlanType>> => {
    try {
      console.log('📝 Creating floor plan:', {
        name: data.name,
        shapesCount: data.shapes?.length || 0
      });
      
      const response = await api.post('/floor-plans', data);
      
      if (response.data.success) {
        console.log('✅ Floor plan created:', response.data.data?.id);
      }
      
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to create floor plan');
    }
  },

  // Update floor plan
  update: async (id: string | number, data: Partial<FloorPlanType>): Promise<ApiResponse<FloorPlanType>> => {
    try {
      console.log('✏️ Updating floor plan:', id);
      const response = await api.put(`/floor-plans/${id}`, data);
      
      if (response.data.success) {
        console.log('✅ Floor plan updated');
      }
      
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to update floor plan');
    }
  },

  // Delete floor plan
  delete: async (id: string | number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/floor-plans/${id}`);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to delete floor plan');
    }
  },

  // Upload image to Cloudinary
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string; thumbnail: string; publicId: string }>> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/floor-plans/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to upload image');
    }
  },

  // Quick save (auto-save)
  quickSave: async (id: string | number, shapes: Shape[]): Promise<ApiResponse<FloorPlanType>> => {
    try {
      const response = await api.patch(`/floor-plans/${id}/quick-save`, { shapes });
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Auto-save failed');
    }
  },

  // Duplicate floor plan
  duplicate: async (id: string | number, newName?: string): Promise<ApiResponse<FloorPlanType>> => {
    try {
      const response = await api.post(`/floor-plans/${id}/duplicate`, { newName });
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to duplicate floor plan');
    }
  },

  // Export floor plan
  export: async (id: string | number, format: 'json' | 'pdf' = 'json'): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/floor-plans/${id}/export`, {
        params: { format },
        responseType: format === 'pdf' ? 'blob' : 'json'
      });
      
      // Handle blob response for PDF
      if (format === 'pdf' && response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `floor-plan-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return {
          success: true,
          message: 'PDF exported successfully'
        };
      }
      
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Export failed');
    }
  }
};