"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Upload, Loader2, Building, User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { exhibitorsAPI } from '@/lib/api/exhibitors';
import toast from 'react-hot-toast';

// Create a type for the form data
interface ExhibitorFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  boothNumber: string;
  website: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  description: string;
  status: 'pending' | 'confirmed' | 'setup' | 'ready' | 'cancelled';
  stallSize: string;
  powerRequirements: string;
  internetRequirements: string;
  additionalRequirements: string;
}

// Map form status to API status
const statusMapping: Record<string, 'pending' | 'active' | 'inactive' | 'approved' | 'rejected'> = {
  'pending': 'pending',
  'confirmed': 'active',
  'setup': 'pending',
  'ready': 'approved',
  'cancelled': 'inactive'
};

export default function NewExhibitorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ExhibitorFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    sector: '',
    boothNumber: '',
    website: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    description: '',
    status: 'pending',
    stallSize: '',
    powerRequirements: '',
    internetRequirements: '',
    additionalRequirements: ''
  });

  const sectors = [
    'Rail Transport',
    'Maritime Logistics',
    'Air Cargo',
    'Warehouse Solutions',
    'Technology & Software',
    'Cold Chain Logistics',
    'Logistics Services',
    'Transport',
    'Shipping',
    'Supply Chain',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Map form data to API data
    const apiData = {
      ...formData,
      booth: formData.boothNumber,
      status: statusMapping[formData.status] || 'pending'
    };

    const response = await exhibitorsAPI.create(apiData);
    
    if (response.id) {
      // Check if response includes plain password
      if (response.plainPassword) {
        // Show success with password
        toast.success(
          <div>
            <p>Exhibitor created successfully!</p>
            <p>Password: <strong>{response.plainPassword}</strong></p>
            <p><small>Please save this password. An email has been sent to the exhibitor.</small></p>
          </div>,
          { duration: 10000 }
        );
      } else {
        toast.success('Exhibitor created successfully!');
      }
      
      router.push('/admin/exhibition/exhibitors');
    } else {
      toast.error('Failed to create exhibitor - no ID returned');
    }
  } catch (error: any) {
    console.error('Error creating exhibitor:', error);
    toast.error(error.message || 'Failed to create exhibitor');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Add New Exhibitor
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new exhibitor account. Login credentials will be emailed automatically.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              form="exhibitor-form"
              disabled={isLoading}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Creating...' : 'Create Exhibitor'}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <form id="exhibitor-form" onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
            {/* Basic Information */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Basic Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Primary contact and company details.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                    Sector *
                  </label>
                  <select
                    id="sector"
                    name="sector"
                    required
                    value={formData.sector}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a sector</option>
                    {sectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Contact Person *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Full name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Address Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Company location details.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="City"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Country"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>

            {/* Exhibition Details */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Exhibition Details
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Information about the exhibition booth and requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="boothNumber" className="block text-sm font-medium text-gray-700">
                    Booth Number *
                  </label>
                  <input
                    type="text"
                    name="boothNumber"
                    id="boothNumber"
                    required
                    value={formData.boothNumber}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="A-101"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="stallSize" className="block text-sm font-medium text-gray-700">
                    Stall Size
                  </label>
                  <select
                    id="stallSize"
                    name="stallSize"
                    value={formData.stallSize}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select size</option>
                    <option value="3x3">3x3 meters</option>
                    <option value="3x6">3x6 meters</option>
                    <option value="6x6">6x6 meters</option>
                    <option value="9x6">9x6 meters</option>
                    <option value="custom">Custom Size</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="setup">Setup in Progress</option>
                    <option value="ready">Ready</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="powerRequirements" className="block text-sm font-medium text-gray-700">
                    Power Requirements
                  </label>
                  <select
                    id="powerRequirements"
                    name="powerRequirements"
                    value={formData.powerRequirements}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select power requirement</option>
                    <option value="basic">Basic (500W)</option>
                    <option value="standard">Standard (1kW)</option>
                    <option value="high">High Power (2kW+)</option>
                    <option value="three-phase">Three-Phase</option>
                    <option value="none">No Power Required</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="internetRequirements" className="block text-sm font-medium text-gray-700">
                    Internet Requirements
                  </label>
                  <select
                    id="internetRequirements"
                    name="internetRequirements"
                    value={formData.internetRequirements}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select internet requirement</option>
                    <option value="none">Not Required</option>
                    <option value="wifi">Wi-Fi Access</option>
                    <option value="wired">Wired Connection</option>
                    <option value="dedicated">Dedicated Line</option>
                    <option value="high-speed">High-Speed Bandwidth</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700">
                    Additional Requirements
                  </label>
                  <textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    rows={3}
                    value={formData.additionalRequirements}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Any special requirements, equipment needs, or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Company Description
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Brief description about the company and exhibition focus.
                </p>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe your company, products, services, and what you'll be showcasing at the exhibition..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  This description will be visible on the exhibition website and app.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}