"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone, Building, CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Exhibitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  booth: string;
  status: 'approved' | 'pending' | 'rejected';
  registrationDate: string;
  website: string;
}

export default function ExhibitorsPage() {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sectors = ['all', 'Rail', 'Maritime', 'Air', 'Warehouse', 'Technology'];
  const statuses = ['all', 'approved', 'pending', 'rejected'];

  useEffect(() => {
    fetchExhibitors();
  }, []);

  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      const response = await api.exhibitors.getAllExhibitors();
      if (response.success) {
        const exhibitorsData = response.data.exhibitors.map((exhibitor: any) => ({
          id: exhibitor.id,
          name: exhibitor.name,
          email: exhibitor.email,
          phone: exhibitor.phone,
          company: exhibitor.company,
          sector: exhibitor.sector,
          booth: exhibitor.boothNumber,
          status: exhibitor.status,
          registrationDate: exhibitor.registrationDate,
          website: exhibitor.website || '#'
        }));
        setExhibitors(exhibitorsData);
      }
    } catch (error) {
      console.error('Error fetching exhibitors:', error);
      setError('Failed to load exhibitors');
      // Fallback to sample data
      setExhibitors(getSampleExhibitors());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exhibitor?')) {
      try {
        const response = await api.exhibitors.deleteExhibitor(id);
        if (response.success) {
          setExhibitors(exhibitors.filter(exhibitor => exhibitor.id !== id));
          alert('Exhibitor deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting exhibitor:', error);
        alert('Failed to delete exhibitor');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: Exhibitor['status']) => {
    try {
      const response = await api.exhibitors.updateExhibitor(id, { status: newStatus });
      if (response.success) {
        setExhibitors(exhibitors.map(exhibitor =>
          exhibitor.id === id ? { ...exhibitor, status: newStatus } : exhibitor
        ));
        alert(`Exhibitor status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await api.exhibitors.exportExhibitors('csv');
      api.downloadFile(blob, `exhibitors-export-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.name.toLowerCase().includes(search.toLowerCase()) ||
                         exhibitor.company.toLowerCase().includes(search.toLowerCase()) ||
                         exhibitor.email.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'all' || exhibitor.sector === selectedSector;
    const matchesStatus = selectedStatus === 'all' || exhibitor.status === selectedStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  if (loading && exhibitors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading exhibitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exhibitors Management</h1>
          <p className="text-gray-600">Manage exhibition participants and their information</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <Link
            href="/admin/exhibition/exhibitors/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Exhibitor
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search exhibitors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector.charAt(0).toUpperCase() + sector.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exhibitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitors.map((exhibitor) => (
          <div key={exhibitor.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exhibitor.company}</h3>
                  <p className="mt-1 text-sm text-gray-500">{exhibitor.name}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  exhibitor.status === 'approved' ? 'bg-green-100 text-green-800' :
                  exhibitor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {exhibitor.status}
                </span>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{exhibitor.sector} • Booth {exhibitor.booth}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${exhibitor.email}`} className="hover:text-blue-600">
                    {exhibitor.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${exhibitor.phone}`} className="hover:text-blue-600">
                    {exhibitor.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Registered: {new Date(exhibitor.registrationDate).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  {exhibitor.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(exhibitor.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(exhibitor.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <Link
                    href={`/admin/exhibition/exhibitors/edit/${exhibitor.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(exhibitor.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredExhibitors.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No exhibitors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search or filter.' : 'No exhibitors registered yet.'}
          </p>
          <div className="mt-6">
            <Link
              href="/admin/exhibition/exhibitors/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Exhibitor
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback function for sample exhibitors
function getSampleExhibitors(): Exhibitor[] {
  return [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@abclogistics.com',
      phone: '+1 (555) 123-4567',
      company: 'ABC Logistics',
      sector: 'Rail',
      booth: 'A-12',
      status: 'approved',
      registrationDate: '2024-01-15',
      website: 'https://abclogistics.com'
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@xyzshipping.com',
      phone: '+1 (555) 987-6543',
      company: 'XYZ Shipping Co.',
      sector: 'Maritime',
      booth: 'B-08',
      status: 'approved',
      registrationDate: '2024-01-14',
      website: 'https://xyzshipping.com'
    },
  ];
}