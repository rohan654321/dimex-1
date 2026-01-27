// hooks/useAPI.ts
import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';

/* =========================
   GENERIC API HOOK
========================= */
export const useAPI = <T,>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (options?: RequestInit) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRequest<T>(endpoint, options);
        setData(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return {
    data,
    loading,
    error,
    fetchData,
    post: (body: any) =>
      fetchData({ method: 'POST', body: JSON.stringify(body) }),
    put: (body: any) =>
      fetchData({ method: 'PUT', body: JSON.stringify(body) }),
    del: () => fetchData({ method: 'DELETE' }),
    setData,
  };
};

/* =========================
   AUTH HOOK (FIXED)
========================= */
export const useAuth = () => {
  const login = useCallback(
    async (
      email: string,
      password: string,
      type: 'admin' | 'exhibitor' = 'admin'
    ) => {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const endpoint =
        type === 'admin' ? '/auth/login' : '/exhibitor/auth/login';

      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || data.error || 'Invalid email or password'
          );
        }

        /* 🔥 UNIVERSAL TOKEN EXTRACTION (THIS FIXES EVERYTHING) */
        const token =
          data.token ||
          data.access_token ||
          data.data?.token ||
          data.data?.access_token;

        if (!token) {
          console.error('❌ LOGIN RESPONSE INVALID:', data);
          throw new Error('Token missing in login response');
        }

        const user =
          data.user ||
          data.data?.user || {
            email,
            role: type,
            name: email.split('@')[0],
          };

        localStorage.setItem(`${type}_token`, token);
        localStorage.setItem(`${type}_user`, JSON.stringify(user));

        return { success: true, token, user };
      } catch (err) {
        localStorage.removeItem(`${type}_token`);
        localStorage.removeItem(`${type}_user`);
        throw err;
      }
    },
    []
  );

  const logout = useCallback((type?: 'admin' | 'exhibitor') => {
    if (type) {
      localStorage.removeItem(`${type}_token`);
      localStorage.removeItem(`${type}_user`);
    } else {
      localStorage.clear();
    }
  }, []);

  const getUser = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const admin = localStorage.getItem('admin_user');
    if (admin) return { ...JSON.parse(admin), type: 'admin' as const };

    const exhibitor = localStorage.getItem('exhibitor_user');
    if (exhibitor)
      return { ...JSON.parse(exhibitor), type: 'exhibitor' as const };

    return null;
  }, []);

  const isAuthenticated = useCallback((type?: 'admin' | 'exhibitor') => {
    if (typeof window === 'undefined') return false;
    if (type) return !!localStorage.getItem(`${type}_token`);
    return (
      !!localStorage.getItem('admin_token') ||
      !!localStorage.getItem('exhibitor_token')
    );
  }, []);

  return {
    login,
    logout,
    getUser,
    isAuthenticated,
  };
};
