// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token') || localStorage.getItem('exhibitor_token');
  }
  return null;
};

// Helper function for API requests
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add custom headers from options
  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers[key] = value;
    });
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Network response was not ok'
    }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Upload helper with FormData
const apiUploadRequest = async <T>(
  endpoint: string,
  formData: FormData
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Upload failed'
    }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// ==================== AUTH API ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// lib/api.ts - Update AuthResponse interface
export interface AuthResponse {
  success: boolean;
  token?: string;
  access_token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  data?: {
    token?: string;
    access_token?: string;
    user?: any;
    [key: string]: any;
  };
  error?: string;
  message?: string;
  status?: string;
  [key: string]: any; // Allow additional properties
}

export const authAPI = {
  // Admin Auth
  login: (credentials: LoginCredentials): Promise<AuthResponse> => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (data: RegisterData): Promise<AuthResponse> =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (): Promise<{ success: boolean }> =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  refreshToken: (): Promise<AuthResponse> =>
    apiRequest('/auth/refresh-token', {
      method: 'POST',
    }),

  // Exhibitor Auth
  exhibitorLogin: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiRequest('/exhibitor/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  exhibitorForgotPassword: (email: string): Promise<{ success: boolean; message: string }> =>
    apiRequest('/exhibitor/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  exhibitorResetPassword: (token: string, password: string): Promise<{ success: boolean; message: string }> =>
    apiRequest('/exhibitor/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  exhibitorGetProfile: (): Promise<{ success: boolean; data: any }> =>
    apiRequest('/exhibitor/auth/profile'),

  exhibitorUpdateProfile: (data: any): Promise<{ success: boolean; data: any }> =>
    apiRequest('/exhibitor/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  exhibitorChangePassword: (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> =>
    apiRequest('/exhibitor/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ==================== USERS API ====================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  phone: string;
  createdAt: string;
  lastLogin: string;
}

export interface UserStats {
  total: number;
  users: User[];
  page: number;
  totalPages: number;
}

export const usersAPI = {
  getAllUsers: (params?: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: UserStats }> => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...params });
    return apiRequest(`/users?${query}`);
  },

  getUser: (id: string): Promise<{ success: boolean; data: User }> =>
    apiRequest(`/users/${id}`),

  createUser: (data: RegisterData & { role?: string }): Promise<{ success: boolean; data: User }> =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (id: string, data: Partial<User>): Promise<{ success: boolean; data: User }> =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),

  getProfile: (): Promise<{ success: boolean; data: User }> =>
    apiRequest('/users/profile/me'),

  updateProfile: (data: Partial<User>): Promise<{ success: boolean; data: User }> =>
    apiRequest('/users/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ==================== ARTICLES API ====================

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  authorId: string;
  publishedDate: string;
  updatedAt: string;
  views: number;
  image?: string;
  tags?: string[];
}

export interface ArticleStats {
  total: number;
  articles: Article[];
  page: number;
  totalPages: number;
}

export const articlesAPI = {
  getAllArticles: (params?: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: ArticleStats }> => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...params });
    return apiRequest(`/articles?${query}`);
  },

  getArticle: (id: string): Promise<{ success: boolean; data: Article }> =>
    apiRequest(`/articles/${id}`),

  createArticle: (data: Omit<Article, 'id' | 'publishedDate' | 'updatedAt' | 'views' | 'authorId'>): Promise<{ success: boolean; data: Article }> =>
    apiRequest('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateArticle: (id: string, data: Partial<Article>): Promise<{ success: boolean; data: Article }> =>
    apiRequest(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteArticle: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/articles/${id}`, {
      method: 'DELETE',
    }),

  uploadImage: (file: File): Promise<{ success: boolean; url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiUploadRequest('/articles/upload', formData);
  },
};

// ==================== EXHIBITORS API ====================

export interface Exhibitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  sector: string;
  boothNumber: string;
  stallDetails?: string;
  status: 'approved' | 'pending' | 'rejected';
  registrationDate: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  contactPerson?: string;
  contactPosition?: string;
  notes?: string;
}

export interface ExhibitorStats {
  total: number;
  exhibitors: Exhibitor[];
  page: number;
  totalPages: number;
}

export const exhibitorsAPI = {
  getAllExhibitors: (params?: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: ExhibitorStats }> => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...params });
    return apiRequest(`/exhibitors?${query}`);
  },

  getExhibitorStats: (): Promise<{ success: boolean; data: any }> =>
    apiRequest('/exhibitors/stats'),

  getExhibitor: (id: string): Promise<{ success: boolean; data: Exhibitor }> =>
    apiRequest(`/exhibitors/${id}`),

  createExhibitor: (data: Omit<Exhibitor, 'id' | 'registrationDate'>): Promise<{ success: boolean; data: Exhibitor }> =>
    apiRequest('/exhibitors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateExhibitor: (id: string, data: Partial<Exhibitor>): Promise<{ success: boolean; data: Exhibitor }> =>
    apiRequest(`/exhibitors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteExhibitor: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/exhibitors/${id}`, {
      method: 'DELETE',
    }),

  bulkUpdateStatus: (ids: string[], status: Exhibitor['status']): Promise<{ success: boolean; message: string }> =>
    apiRequest('/exhibitors/bulk/update-status', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    }),

  exportExhibitors: (format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> =>
    fetch(`${API_BASE_URL}/exhibitors/export/data?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    }).then(res => res.blob()),
};

// ==================== FLOOR PLANS API ====================

export interface FloorPlan {
  id: string;
  name: string;
  description?: string;
  floor: string;
  scale: number;
  gridSize: number;
  image?: string;
  shapes: any[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    version: string;
  };
}

export interface FloorPlanStats {
  total: number;
  floorPlans: FloorPlan[];
  page: number;
  totalPages: number;
}

export const floorPlansAPI = {
  getAllFloorPlans: (params?: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: FloorPlanStats }> => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...params });
    return apiRequest(`/floor-plans?${query}`);
  },

  getFloorPlan: (id: string): Promise<{ success: boolean; data: FloorPlan }> =>
    apiRequest(`/floor-plans/${id}`),

  createFloorPlan: (data: Omit<FloorPlan, 'id' | 'metadata'>): Promise<{ success: boolean; data: FloorPlan }> =>
    apiRequest('/floor-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateFloorPlan: (id: string, data: Partial<FloorPlan>): Promise<{ success: boolean; data: FloorPlan }> =>
    apiRequest(`/floor-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteFloorPlan: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/floor-plans/${id}`, {
      method: 'DELETE',
    }),

  exportFloorPlan: (id: string, format: 'png' | 'pdf' | 'json' = 'png'): Promise<Blob> =>
    fetch(`${API_BASE_URL}/floor-plans/${id}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    }).then(res => res.blob()),

  duplicateFloorPlan: (id: string): Promise<{ success: boolean; data: FloorPlan }> =>
    apiRequest(`/floor-plans/${id}/duplicate`, {
      method: 'POST',
    }),

  uploadFloorPlanImage: (id: string, file: File): Promise<{ success: boolean; url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiUploadRequest(`/floor-plans/${id}/upload-image`, formData);
  },
};

// ==================== PAYMENTS API ====================

export interface Payment {
  id: string;
  invoiceId?: string;
  invoiceNumber?: string;
  exhibitorId: string;
  exhibitorName: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'check' | 'cash' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  notes?: string;
  createdAt: string;
  processedBy?: string;
}

export interface PaymentStats {
  total: number;
  payments: Payment[];
  page: number;
  totalPages: number;
}

export const paymentsAPI = {
  getAllPayments: (params?: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: PaymentStats }> => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...params });
    return apiRequest(`/payments?${query}`);
  },

  getPaymentStats: (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{ success: boolean; data: any }> =>
    apiRequest(`/payments/stats?period=${period}`),

  getPayment: (id: string): Promise<{ success: boolean; data: Payment }> =>
    apiRequest(`/payments/${id}`),

  getPaymentsByInvoice: (invoiceId: string): Promise<{ success: boolean; data: Payment[] }> =>
    apiRequest(`/payments/invoice/${invoiceId}`),

  getRecentPayments: (limit: number = 10): Promise<{ success: boolean; data: Payment[] }> =>
    apiRequest(`/payments/recent/latest?limit=${limit}`),

  createPayment: (data: Omit<Payment, 'id' | 'createdAt'>): Promise<{ success: boolean; data: Payment }> =>
    apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePaymentStatus: (id: string, status: Payment['status']): Promise<{ success: boolean; data: Payment }> =>
    apiRequest(`/payments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  refundPayment: (id: string, reason?: string): Promise<{ success: boolean; data: Payment }> =>
    apiRequest(`/payments/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  processBulkPayments: (payments: Array<Omit<Payment, 'id' | 'createdAt'>>): Promise<{ success: boolean; data: Payment[] }> =>
    apiRequest('/payments/bulk/process', {
      method: 'POST',
      body: JSON.stringify({ payments }),
    }),
      exportPayments: (
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> =>
    fetch(`${API_BASE_URL}/payments/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }).then(res => {
      if (!res.ok) {
        throw new Error('Failed to export payments');
      }
      return res.blob();
    }),

};

// ==================== INVOICES API ====================

export interface Invoice {
  id: string;
  invoiceNumber: string;
  exhibitorId: string;
  exhibitorName: string;
  company: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
  paymentId?: string;
}

export interface InvoiceStats {
  total: number;
  invoices: Invoice[];
  page: number;
  totalPages: number;
}

export const invoicesAPI = {
  getAllInvoices: (params?: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: InvoiceStats }> => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...params });
    return apiRequest(`/invoices?${query}`);
  },

  getInvoiceStats: (): Promise<{ success: boolean; data: any }> =>
    apiRequest('/invoices/stats'),

  getInvoice: (id: string): Promise<{ success: boolean; data: Invoice }> =>
    apiRequest(`/invoices/${id}`),

  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'issueDate' | 'status' | 'paymentId'>): Promise<{ success: boolean; data: Invoice }> =>
    apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateInvoice: (id: string, data: Partial<Invoice>): Promise<{ success: boolean; data: Invoice }> =>
    apiRequest(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteInvoice: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/invoices/${id}`, {
      method: 'DELETE',
    }),

  generateInvoicePdf: (id: string): Promise<Blob> =>
    fetch(`${API_BASE_URL}/invoices/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    }).then(res => res.blob()),

  sendInvoiceEmail: (id: string, email?: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/invoices/${id}/send-email`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  bulkGenerateInvoices: (exhibitorIds: string[], templateId?: string): Promise<{ success: boolean; data: Invoice[] }> =>
    apiRequest('/invoices/bulk/generate', {
      method: 'POST',
      body: JSON.stringify({ exhibitorIds, templateId }),
    }),

  // Exhibitor-specific invoice methods
  getInvoicesByExhibitor: (exhibitorId: string): Promise<{ success: boolean; data: Invoice[] }> =>
    apiRequest(`/invoices/exhibitor/${exhibitorId}`),

  markInvoiceAsPaid: (invoiceId: string, paymentId: string): Promise<{ success: boolean; data: Invoice }> =>
    apiRequest(`/invoices/${invoiceId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ paymentId }),
    }),
};

// ==================== REVENUE API ====================

export interface RevenueData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  exhibitors: number;
  growth: number;
}

export interface RevenueSource {
  category: string;
  amount: number;
  percentage: number;
  growth: number;
}

export const revenueAPI = {
  getRevenueSummary: (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{ success: boolean; data: any }> =>
    apiRequest(`/revenue/summary?period=${period}`),

  getRevenueBySector: (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{ success: boolean; data: RevenueSource[] }> =>
    apiRequest(`/revenue/by-sector?period=${period}`),

  getRevenueGrowth: (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{ success: boolean; data: RevenueData[] }> =>
    apiRequest(`/revenue/growth?period=${period}`),

  getTopRevenueSources: (limit: number = 5): Promise<{ success: boolean; data: RevenueSource[] }> =>
    apiRequest(`/revenue/top-sources?limit=${limit}`),

  exportRevenueReport: (format: 'csv' | 'excel' | 'pdf' = 'csv', period: 'month' | 'quarter' | 'year' = 'year'): Promise<Blob> =>
    fetch(`${API_BASE_URL}/revenue/export?format=${format}&period=${period}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    }).then(res => res.blob()),

  getDashboardMetrics: (): Promise<{ success: boolean; data: any }> =>
    apiRequest('/revenue/dashboard-metrics'),

  getRevenueForecast: (periods: number = 12): Promise<{ success: boolean; data: RevenueData[] }> =>
    apiRequest(`/revenue/forecast?periods=${periods}`),
};

// ==================== MEDIA API ====================

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  size: string;
  uploaded: string;
  uploadedBy: string;
  dimensions?: string;
  duration?: string;
  thumbnail?: string;
}

export interface MediaStats {
  total: number;
  media: MediaItem[];
  page: number;
  totalPages: number;
}

export const mediaAPI = {
  getAllMedia: (params?: any, page: number = 1, limit: number = 10): Promise<{ success: boolean; data: MediaStats }> => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString(), ...params });
    return apiRequest(`/media?${query}`);
  },

  getMediaStats: (): Promise<{ success: boolean; data: any }> =>
    apiRequest('/media/stats'),

  getMedia: (id: string): Promise<{ success: boolean; data: MediaItem }> =>
    apiRequest(`/media/${id}`),

  uploadMedia: (file: File, metadata?: Partial<MediaItem>): Promise<{ success: boolean; data: MediaItem }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }
    return apiUploadRequest('/media/upload', formData);
  },

  updateMedia: (id: string, data: Partial<MediaItem>): Promise<{ success: boolean; data: MediaItem }> =>
    apiRequest(`/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMedia: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest(`/media/${id}`, {
      method: 'DELETE',
    }),

  bulkUpload: (files: File[]): Promise<{ success: boolean; data: MediaItem[] }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return apiUploadRequest('/media/bulk-upload', formData);
  },

  cleanupOrphanedFiles: (): Promise<{ success: boolean; message: string; cleaned: number }> =>
    apiRequest('/media/cleanup', {
      method: 'POST',
    }),
};

// ==================== MONITORING API ====================

export interface HealthCheck {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
  version: string;
  environment: string;
  database: string;
}

export interface Metrics {
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  };
  cpu: NodeJS.CpuUsage;
  uptime: number;
  nodeVersion: string;
}

export const monitoringAPI = {
  getHealth: (): Promise<HealthCheck> =>
    apiRequest('/monitoring/health'),

  getMetrics: (): Promise<Metrics> =>
    apiRequest('/monitoring/metrics'),
};

// ==================== DASHBOARD API ====================

export interface DashboardSummary {
  users: {
    total: number;
    recent: User[];
  };
  articles: {
    total: number;
    recent: Article[];
  };
  exhibitors: {
    total: number;
    recent: Exhibitor[];
  };
  payments: any;
  revenue: any;
  activities: Array<{
    id: number;
    action: string;
    user: string;
    time: string;
  }>;
}

export const dashboardAPI = {
  getSummary: (): Promise<{ success: boolean; data: DashboardSummary }> =>
    apiRequest('/dashboard/summary'),
};

// ==================== EXHIBITOR DASHBOARD API ====================

export interface ExhibitorDashboard {
  exhibitor: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    boothNumber: string;
    stallDetails?: string;
  };
  floorPlan?: {
    id: string;
    name: string;
    floor: string;
    scale: number;
    gridSize: number;
  };
  booth?: any;
  invoices: Invoice[];
}

export interface ExhibitorRequirement {
  id: string;
  type: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected';
  cost: number;
  quantity?: number;
  submittedAt: string;
  processedAt?: string;
}

export interface ExhibitorManual {
  id: string;
  title: string;
  description: string;
  category: string;
  version: string;
  fileUrl: string;
  fileSize: string;
  lastUpdated: string;
}

export const exhibitorDashboardAPI = {
  getLayout: (): Promise<{ success: boolean; data: ExhibitorDashboard }> =>
    apiRequest('/exhibitor/dashboard/layout'),

  getInvoices: (): Promise<{ success: boolean; data: Invoice[] }> =>
    apiRequest('/exhibitor/dashboard/invoices'),

  getRequirements: (): Promise<{ success: boolean; data: ExhibitorRequirement[] }> =>
    apiRequest('/exhibitor/dashboard/requirements'),

  submitRequirement: (data: { type: string; description: string; quantity?: number }): Promise<{ success: boolean; data: ExhibitorRequirement }> =>
    apiRequest('/exhibitor/dashboard/requirements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getManual: (): Promise<{ success: boolean; data: { sections: ExhibitorManual[] } }> =>
    apiRequest('/exhibitor/dashboard/manual'),

  downloadInvoicePdf: (id: string): Promise<Blob> =>
    fetch(`${API_BASE_URL}/exhibitor/dashboard/invoices/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    }).then(res => res.blob()),

  makePayment: (id: string, method: string, transactionId?: string): Promise<{ success: boolean; data: { payment: Payment; invoice: Invoice } }> =>
    apiRequest(`/exhibitor/dashboard/invoices/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ method, transactionId }),
    }),
};

// ==================== UTILITY FUNCTIONS ====================

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date, format: 'short' | 'medium' | 'long' = 'medium') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {};

  if (format === 'short') {
    options.year = 'numeric';
    options.month = 'short';
    options.day = 'numeric';
  } else if (format === 'medium') {
    options.year = 'numeric';
    options.month = 'long';
    options.day = 'numeric';
    options.hour = '2-digit';
    options.minute = '2-digit';
  } else if (format === 'long') {
    options.weekday = 'long';
    options.year = 'numeric';
    options.month = 'long';
    options.day = 'numeric';
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }

  return dateObj.toLocaleDateString('en-US', options);
};

// ==================== AUTH MANAGEMENT ====================

export const setAuthToken = (token: string, type: 'admin' | 'exhibitor' = 'admin') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${type}_token`, token);
  }
};

export const removeAuthToken = (type?: 'admin' | 'exhibitor') => {
  if (typeof window !== 'undefined') {
    if (type) {
      localStorage.removeItem(`${type}_token`);
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('exhibitor_token');
    }
  }
};

export const isAuthenticated = (type?: 'admin' | 'exhibitor'): boolean => {
  if (typeof window === 'undefined') return false;
  
  if (type) {
    return !!localStorage.getItem(`${type}_token`);
  }
  
  return !!localStorage.getItem('admin_token') || !!localStorage.getItem('exhibitor_token');
};

// Export all APIs as a single object
export const api = {
  auth: authAPI,
  users: usersAPI,
  articles: articlesAPI,
  exhibitors: exhibitorsAPI,
  floorPlans: floorPlansAPI,
  payments: paymentsAPI,
  invoices: invoicesAPI,
  revenue: revenueAPI,
  media: mediaAPI,
  monitoring: monitoringAPI,
  dashboard: dashboardAPI,
  exhibitorDashboard: exhibitorDashboardAPI,
  
  // Utilities
  downloadFile,
  formatCurrency,
  formatDate,
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
};

export default api;
