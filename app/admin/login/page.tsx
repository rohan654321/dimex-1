"use client";

import React from "react"

import { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2, Shield, Server } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@exhibition.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiUrl, setApiUrl] = useState('');
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated('admin')) {
      router.push('/admin/dashboard');
    }
  }, [router, isAuthenticated]);

  // Set API URL and check status
  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    setApiUrl(API_BASE_URL);

    const checkApiStatus = async () => {
      try {
        console.log('🔍 Checking API at:', `${API_BASE_URL}/api/monitoring/health`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${API_BASE_URL}/api/monitoring/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Health check response:', data);
          setApiStatus('online');
        } else {
          console.log('⚠️ API responded with error:', response.status);
          setApiStatus('offline');
        }
      } catch (error: any) {
        console.error('❌ API health check failed:', error);
        if (error.name === 'AbortError') {
          console.error('⏰ API request timeout');
          setApiStatus('offline');
        } else {
          setApiStatus('offline');
        }
      }
    };

    checkApiStatus();
  }, []);

// app/admin/login/page.tsx - Updated handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    console.log('🚀 Starting login process...');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password.length > 0 ? '***' : 'empty');
    console.log('🌐 API URL:', apiUrl);
    
    const result = await login(email, password, 'admin');
    
    console.log('🎉 Login result:', result);
    
    if (result.success) {
      // Wait a moment for localStorage to be updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify auth is stored
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        console.log('🔍 After login - localStorage:', {
          token: token ? `${token.substring(0, 20)}...` : 'none',
          user: user ? JSON.parse(user) : 'none'
        });
      }
      
      console.log('🔗 Redirecting to dashboard...');
      router.push('/admin/dashboard');
    } else {
      setError(result.message || 'Login failed');
      setIsLoading(false);
    }
  } catch (error: any) {
    console.error('💥 Login error:', error);
    console.error('💥 Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    let errorMessage = error.message || 'An error occurred during login';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      errorMessage = `Cannot connect to server at ${apiUrl}. Please ensure:
      1. The backend server is running (check Docker logs)
      2. The API URL is correct
      3. There are no network issues`;
    } else if (error.message.includes('401')) {
      errorMessage = 'Invalid email or password. Please try again.';
    }
    
    setError(errorMessage);
    setIsLoading(false);
  }
};

  const handleDemoLogin = async () => {
    setEmail('admin@exhibition.com');
    setPassword('admin123');
    
    // Auto-submit after a short delay
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }, 100);
  };

  const handleTestApi = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      console.log('🧪 Testing direct API call to:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@exhibition.com',
          password: 'admin123'
        })
      });
      
      console.log('🧪 Direct API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 Direct API response data:', data);
        setError(`✅ API Test Successful! Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        console.error('🧪 Direct API error:', errorText);
        setError(`❌ API Test Failed (${response.status}): ${errorText}`);
      }
    } catch (error: any) {
      console.error('🧪 Direct API test error:', error);
      setError(`❌ API Test Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900">
          Admin Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Exhibition Management System
        </p>

        {/* API Status */}
        <div className={`mt-4 rounded-lg p-4 text-center ${apiStatus === 'online' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`h-3 w-3 rounded-full ${apiStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${apiStatus === 'online' ? 'text-green-800' : 'text-red-800'}`}>
              API Status: {apiStatus === 'online' ? 'Connected' : apiStatus === 'offline' ? 'Disconnected' : 'Checking...'}
            </span>
          </div>
          <p className="text-xs text-gray-600 break-all">
            Endpoint: {apiUrl}/api/auth/login
          </p>
          <button
            onClick={handleTestApi}
            disabled={isLoading}
            className="mt-2 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
          >
            Test API Connection
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-blue-700">Email:</span>
                <code className="bg-white px-2 py-1 rounded border border-blue-300 text-blue-800 font-mono">admin@exhibition.com</code>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-blue-700">Password:</span>
                <code className="bg-white px-2 py-1 rounded border border-blue-300 text-blue-800 font-mono">admin123</code>
              </div>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors w-full disabled:opacity-50"
            >
              Use Demo Credentials
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-xl sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 animate-in fade-in duration-300 border border-red-200">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800">Login Error</h3>
                    <div className="mt-1 text-sm text-red-700 whitespace-pre-wrap break-words">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="admin@exhibition.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Signing in...
                  </>
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server className="h-4 w-4 text-gray-400" />
                <p className="text-xs text-gray-500">
                  API Endpoint: {apiUrl}/api/auth/login
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Check browser console for detailed debug information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
