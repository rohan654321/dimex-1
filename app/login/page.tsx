"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authAPI, testServerConnection, testLoginEndpoint } from "@/lib/api/exhibitors";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Starting login process...');
      
      // Enable debug mode automatically on first error
      if (!debugMode) {
        setDebugMode(true);
      }
      
      // Test server connection first
      console.log('🔍 Testing server connection...');
      const serverTest = await testServerConnection();
      if (!serverTest.success) {
        toast.error(serverTest.error || 'Server connection failed');
        return;
      }
      
      console.log('✅ Server connection successful');
      console.log('🔐 Attempting login with:', formData.email);
      
      const result = await authAPI.login(formData.email, formData.password);
      
      console.log('✅ Login successful:', result);
      
      // Store token and user data
      localStorage.setItem("exhibitor_token", result.token);
      localStorage.setItem("exhibitor_data", JSON.stringify(result.exhibitor));
      
      toast.success("Login successful! Welcome back.");
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let errorMessage = error.message || "Login failed";
      
      // Provide troubleshooting tips
      let troubleshooting = '';
      
      if (error.message.includes('Cannot connect to server')) {
        troubleshooting = 'Please ensure the backend server is running on port 5000';
      } else if (error.message.includes('Invalid email or password')) {
        troubleshooting = 'Check your credentials or contact administrator';
      } else if (error.message.includes('Account is not active')) {
        troubleshooting = 'Your account needs to be approved by administrator';
      }
      
      toast.error(
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          {troubleshooting && (
            <p className="text-sm text-gray-600">{troubleshooting}</p>
          )}
        </div>,
        { duration: 5000 }
      );
      
    } finally {
      setLoading(false);
    }
  };

  const runDebugTests = async () => {
    console.log('🔧 Running debug tests...');
    
    // Test 1: Server connection
    toast.loading('Testing server connection...');
    const serverTest = await testServerConnection();
    
    if (serverTest.success) {
      toast.success('✅ Server is running');
    } else {
      toast.error('❌ Server connection failed');
    }
    
    // Test 2: Login endpoint
    toast.loading('Testing login endpoint...');
    const loginTest = await testLoginEndpoint();
    
    if (loginTest.success) {
      toast.success('✅ Login endpoint is working');
    } else {
      toast.error('❌ Login endpoint failed');
    }
    
    console.log('Debug tests completed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exhibitor Portal
          </h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
          
          {debugMode && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Debug Mode:</strong> Server URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}
              </p>
              <button
                onClick={runDebugTests}
                className="mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                Run Connection Tests
              </button>
            </div>
          )}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="you@company.com"
                  disabled={loading}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>

            {/* Debug Info */}
            {debugMode && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Debug Info:</strong> Check browser console for detailed logs
                </p>
                <button
                  type="button"
                  onClick={() => {
                    console.log('🔧 Current form data:', formData);
                    console.log('🔧 LocalStorage:', {
                      token: localStorage.getItem('exhibitor_token'),
                      data: localStorage.getItem('exhibitor_data')
                    });
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Log Debug Info
                </button>
              </div>
            )}

            {/* Help Text */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <a
                  href="mailto:support@exhibition.com"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Contact support
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Exhibition Management System
          </p>
          <button
            onClick={() => setDebugMode(!debugMode)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            {debugMode ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
      </div>
    </div>
  );
}