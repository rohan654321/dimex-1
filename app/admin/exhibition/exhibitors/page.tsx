"use client";

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone, Building, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Exhibitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  booth: string;
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  website: string;
  createdAt?: string;
  stallDetails?: any;
}

interface StatusStat {
  _id: string;
  count: number;
}

interface SectorStat {
  _id: string;
  count: number;
}

interface ExhibitorStats {
  byStatus?: StatusStat[];
  bySector?: SectorStat[];
  total?: number;
}

export default function ExhibitorsPage() {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([
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
    {
      id: '3',
      name: 'Robert Chen',
      email: 'robert@techlogistics.com',
      phone: '+1 (555) 456-7890',
      company: 'Tech Logistics Inc.',
      sector: 'Technology',
      booth: 'C-15',
      status: 'pending',
      registrationDate: '2024-01-16',
      website: 'https://techlogistics.com'
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarah@warehousesolutions.com',
      phone: '+1 (555) 234-5678',
      company: 'Warehouse Solutions Ltd.',
      sector: 'Warehouse',
      booth: 'A-22',
      status: 'approved',
      registrationDate: '2024-01-12',
      website: 'https://warehousesolutions.com'
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael@aircargo.com',
      phone: '+1 (555) 345-6789',
      company: 'Air Cargo Express',
      sector: 'Air',
      booth: 'B-18',
      status: 'rejected',
      registrationDate: '2024-01-11',
      website: 'https://aircargo.com'
    }
  ]);

  const sectors = ['all', 'Rail', 'Maritime', 'Air', 'Warehouse', 'Technology'];
  const statuses = ['all', 'approved', 'pending', 'rejected'];

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exhibitor?')) {
      setExhibitors(exhibitors.filter(exhibitor => exhibitor.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: Exhibitor['status']) => {
    setExhibitors(exhibitors.map(exhibitor =>
      exhibitor.id === id ? { ...exhibitor, status: newStatus } : exhibitor
    ));
  };

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.name.toLowerCase().includes(search.toLowerCase()) ||
                         exhibitor.company.toLowerCase().includes(search.toLowerCase()) ||
                         exhibitor.email.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'all' || exhibitor.sector === selectedSector;
    const matchesStatus = selectedStatus === 'all' || exhibitor.status === selectedStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exhibitors Management</h1>
          <p className="text-gray-600">Manage exhibition participants and their information</p>
        </div>
        <Link
          href="/admin/exhibition/exhibitors/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Exhibitor
        </Link>
      </div>

      {/* Stats Section */}
      {!statsLoading && exhibitorStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-100">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total Exhibitors</p>
                <p className="text-2xl font-semibold text-gray-900">{total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exhibitorStats.byStatus?.find((s: { _id: string; }) => s._id === 'active')?.count || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-yellow-100">
                <Loader2 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exhibitorStats.byStatus?.find((s: { _id: string; }) => s._id === 'pending')?.count || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-purple-100">
                <Filter className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Sectors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exhibitorStats.bySector?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bulk Actions</label>
            <select
              onChange={(e) => handleBulkStatusUpdate(e.target.value)}
              defaultValue=""
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled>Update Status...</option>
              <option value="active">Mark as Active</option>
              <option value="inactive">Mark as Inactive</option>
              <option value="approved">Mark as Approved</option>
              <option value="rejected">Mark as Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exhibitors Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exhibitor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exhibitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No exhibitors found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {search ? 'Try adjusting your search or filter.' : 'No exhibitors registered yet.'}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleCreateExhibitor}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Exhibitor
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                exhibitors.map((exhibitor: Exhibitor) => (
                  <tr key={exhibitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {exhibitor.company?.charAt(0) || 'E'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {exhibitor.company}
                          </div>
                          <div className="text-sm text-gray-500">
                            {exhibitor.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {exhibitor.sector}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <a href={`mailto:${exhibitor.email}`} className="hover:text-blue-600">
                            {exhibitor.email}
                          </a>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <a href={`tel:${exhibitor.phone}`} className="hover:text-blue-600">
                            {exhibitor.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>Booth: <span className="font-medium">{exhibitor.booth || 'Not assigned'}</span></div>
                        {exhibitor.website && (
                          <div className="mt-1">
                            <a 
                              href={exhibitor.website.startsWith('http') ? exhibitor.website : `https://${exhibitor.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              {exhibitor.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(exhibitor.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exhibitor.status)}`}>
                          {exhibitor.status}
                        </span>
                      </div>
                      {exhibitor.status === 'pending' && (
                        <div className="flex space-x-1 mt-2">
                          <button
                            onClick={() => handleStatusChange(exhibitor.id, 'approved')}
                            className="text-green-600 hover:text-green-900 text-xs flex items-center"
                            title="Approve"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(exhibitor.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 text-xs flex items-center"
                            title="Reject"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(exhibitor.registrationDate || exhibitor.createdAt || '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewExhibitor(exhibitor.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditExhibitor(exhibitor.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exhibitor.id)}
                          disabled={isDeleting === exhibitor.id}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          {isDeleting === exhibitor.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, total)}
                  </span>{' '}
                  of <span className="font-medium">{total}</span> exhibitors
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
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