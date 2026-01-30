import api from './api';

export const financialAPI = {
  // Invoices
  invoices: {
    getAll: async (params = {}) => {
      const response = await api.get('/invoices', { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    },

    create: async (data) => {
      const response = await api.post('/invoices', data);
      return response.data;
    },

    update: async (id, data) => {
      const response = await api.put(`/invoices/${id}`, data);
      return response.data;
    },

    delete: async (id) => {
      const response = await api.delete(`/invoices/${id}`);
      return response.data;
    },

    getStats: async () => {
      const response = await api.get('/invoices/stats');
      return response.data;
    },

    generatePDF: async (id) => {
      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    },

    sendEmail: async (id) => {
      const response = await api.post(`/invoices/${id}/send-email`);
      return response.data;
    }
  },

  // Payments
  payments: {
    getAll: async (params = {}) => {
      const response = await api.get('/payments', { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    },

    create: async (data) => {
      const response = await api.post('/payments', data);
      return response.data;
    },

    updateStatus: async (id, status) => {
      const response = await api.patch(`/payments/${id}/status`, { status });
      return response.data;
    },

    refund: async (id) => {
      const response = await api.post(`/payments/${id}/refund`);
      return response.data;
    },

    getStats: async () => {
      const response = await api.get('/payments/stats');
      return response.data;
    }
  },

  // Revenue
  revenue: {
    getSummary: async (timeRange = 'month') => {
      const response = await api.get('/revenue/summary', { params: { timeRange } });
      return response.data;
    },

    getBySector: async () => {
      const response = await api.get('/revenue/by-sector');
      return response.data;
    },

    getGrowth: async (periods = 12) => {
      const response = await api.get('/revenue/growth', { params: { periods } });
      return response.data;
    },

    getTopSources: async (limit = 5) => {
      const response = await api.get('/revenue/top-sources', { params: { limit } });
      return response.data;
    },

    getDashboardMetrics: async () => {
      const response = await api.get('/revenue/dashboard-metrics');
      return response.data;
    },

    getForecast: async (months = 6) => {
      const response = await api.get('/revenue/forecast', { params: { months } });
      return response.data;
    }
  }
};