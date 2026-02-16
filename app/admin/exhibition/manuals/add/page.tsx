'use client';

import { useState, useEffect } from 'react';
import {
  DocumentIcon,
  ArrowLeftIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diemex-backend.onrender.com';

export default function AddManualPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = ['general', 'setup', 'rules', 'contact'];

  // Check authentication on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('admin_token');
    if (!storedToken) {
      setError('Please login first');
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login?redirect=/dashboard/manual/add');
      }, 2000);
      return;
    }
    setToken(storedToken);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Authentication required. Please login again.');
      setTimeout(() => {
        router.push('/login?redirect=/dashboard/manual/add');
      }, 2000);
      return;
    }
    
    // Validate required fields
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);

      if (file) {
        formData.append('file', file);
      }

      console.log('Submitting manual with data:', {
        title: title.trim(),
        description: description.trim(),
        category,
        file: file ? file.name : 'No file'
      });

      const response = await fetch(`${API_BASE_URL}/api/manuals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Log response status for debugging
      console.log('Response status:', response.status);

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin_token');
        throw new Error('Authentication expired. Please login again.');
      }

      if (response.status === 403) {
        throw new Error('You do not have permission to add manuals. Admin access required.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add manual (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        alert('Manual added successfully!');
        router.push('/dashboard/manual');
      } else {
        throw new Error(data.message || 'Failed to add manual');
      }
    } catch (error) {
      console.error('Error adding manual:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        e.target.value = '';
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  // Show error state
  if (error && !token) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DocumentIcon className="h-6 w-6 text-gray-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Add Manual Section
            </h1>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DocumentIcon className="h-6 w-6 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Add Manual Section
          </h1>
        </div>

        <button
          onClick={() => router.push('/dashboard/manual')}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter section title"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter manual content..."
              disabled={loading}
            />
          </div>

          {/* Category Pills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  disabled={loading}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload PDF (Optional)
            </label>

            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block mx-auto text-sm text-gray-600"
                disabled={loading}
              />
              {file && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Only PDF files allowed (max 10MB)
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !token}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Manual Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}