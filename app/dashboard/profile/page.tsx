'use client';

import { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  CameraIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { ExhibitorProfile } from '@/types';

const initialProfile: ExhibitorProfile = {
  id: 'EXH2024-001',
  companyName: 'Tech Innovations Inc.',
  contactPerson: 'John Smith',
  email: 'john@techinnovations.com',
  phone: '+1 (555) 123-4567',
  address: '123 Tech Street, Suite 450, Silicon Valley, CA 94000',
  website: 'www.techinnovations.com',
  industry: 'Technology & Software',
  description: 'Leading provider of innovative tech solutions for modern businesses. We specialize in AI-driven analytics and cloud infrastructure.',
  status: 'active',
};

export default function EnhancedProfilePage() {
  const [profile, setProfile] = useState<ExhibitorProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Get exhibitor token
      const token = localStorage.getItem('exhibitorToken') || localStorage.getItem('token');
      
      // Fetch from your existing exhibitor route
      // You might need to check what endpoint returns exhibitor profile
      const response = await axios.get('/api/exhibitorDashboard/layout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const exhibitorData = response.data.data.exhibitor;
        
        // Map the data to your profile structure
        const profileData: ExhibitorProfile = {
          id: exhibitorData.id || 'EXH2024-001',
          companyName: exhibitorData.company || 'Tech Innovations Inc.',
          contactPerson: exhibitorData.name || 'John Smith',
          email: exhibitorData.email || 'john@techinnovations.com',
          phone: exhibitorData.phone || '+1 (555) 123-4567',
          address: exhibitorData.address || '123 Tech Street, Suite 450, Silicon Valley, CA 94000',
          website: exhibitorData.website || 'www.techinnovations.com',
          industry: exhibitorData.sector || 'Technology & Software',
          description: exhibitorData.description || 'Leading provider of innovative tech solutions...',
          status: exhibitorData.status || 'active',
        };
        
        setProfile(profileData);
        setEditedProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use initial profile if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('exhibitorToken') || localStorage.getItem('token');
      
      // Update profile - you need to implement an update endpoint
      // For now, just update local state
      // In production, you would make a PUT request:
      // await axios.put('/api/exhibitors/profile', editedProfile, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof ExhibitorProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 h-48 animate-pulse"></div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-2 bg-gray-200 rounded-lg h-10 w-10"></div>
                      <div>
                        <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-5 w-36 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i}>
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">Manage your exhibitor information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <CheckIcon className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center gap-2"
              >
                <XMarkIcon className="h-4 w-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="card overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex flex-col items-center text-center text-white">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <BuildingOfficeIcon className="h-12 w-12 text-white/90" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <CameraIcon className="h-4 w-4 text-gray-700" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold">{profile.companyName}</h2>
                <p className="text-blue-100 text-sm mt-1">{profile.industry}</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <UserCircleIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-medium text-gray-900">{profile.contactPerson}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <EnvelopeIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <GlobeAltIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={`https://${profile.website}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className={`badge ${
                    profile.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : profile.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="section-title">Company Information</h2>
                  <p className="section-subtitle">Update your company details and description</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{profile.companyName}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.industry}
                        onChange={(e) => handleChange('industry', e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{profile.industry}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.contactPerson}
                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{profile.contactPerson}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{profile.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      Company Address
                    </div>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={3}
                      className="input-field"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-line">{profile.address}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      className="input-field"
                      placeholder="Tell us about your company, products, and services..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-line">{profile.description}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    This description will be displayed in the exhibition catalog
                  </p>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={editedProfile.website}
                          onChange={(e) => handleChange('website', e.target.value)}
                          className="input-field"
                          placeholder="www.example.com"
                        />
                      </div>
                      <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Test Link
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <a 
                        href={`https://${profile.website}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}