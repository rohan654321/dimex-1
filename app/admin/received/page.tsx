// app/admin/extra-requirements/received/page.tsx
'use client';

import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  DocumentTextIcon,
  EyeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  WrenchIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { SofaIcon, MonitorIcon, ZapIcon, CableIcon, DropletIcon, PackageIcon } from 'lucide-react';

const API_BASE_URL = 'https://diemex-backend.onrender.com';

interface RequirementItem {
  id: string;
  type: string;
  quantity: number;
  description: string;
  unitPrice?: number;
  totalPrice?: number;
  status?: string;
}

interface Requirement {
  id: string;
  requirementId: string;
  exhibitorId: string;
  stallNumber?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  submittedAt: string;
  updatedAt: string;
  notes?: string;
  items: RequirementItem[];
  metadata?: {
    boothArea?: string;
    boothLocation?: string;
    eventName?: string;
    eventDate?: string;
    address?: string;
  };
}

export default function AdminReceivedRequirementsPage() {
  const router = useRouter();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  useEffect(() => {
    filterRequirements();
  }, [searchTerm, statusFilter, requirements]);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      
      if (!token) {
        console.error('No admin token found. Please login again.');
        router.push('/admin/login');
        setLoading(false);
        return;
      }
      
      // Try to fetch from the actual endpoint
      try {
        const response = await fetch(`${API_BASE_URL}/api/extra-requirements/admin/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setRequirements(data.data);
          updateStats(data.data);
          setLoading(false);
          return;
        } else if (response.status === 404) {
          console.log('Endpoint not found, trying alternative endpoints...');
        }
      } catch (error) {
        console.log('Primary endpoint failed, trying alternatives...');
      }
      
      // Try alternative endpoints
      const alternativeEndpoints = [
        `${API_BASE_URL}/api/requirements/admin/all`,
        `${API_BASE_URL}/api/requirements`,
        `${API_BASE_URL}/api/exhibitors/requirements`,
      ];
      
      let found = false;
      for (const endpoint of alternativeEndpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            // Transform data if needed
            const transformedData = transformRequirementsData(data.data || data);
            setRequirements(transformedData);
            updateStats(transformedData);
            found = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (!found) {
        // Use mock data for development/testing
        console.log('Using mock data for development');
        const mockData = generateMockRequirements();
        setRequirements(mockData);
        updateStats(mockData);
      }
      
    } catch (error) {
      console.error('Error fetching requirements:', error);
      // Use mock data on error
      const mockData = generateMockRequirements();
      setRequirements(mockData);
      updateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const transformRequirementsData = (data: any[]): Requirement[] => {
    // Transform your existing data structure to match the Requirement interface
    return data.map((item: any) => ({
      id: item.id || item._id,
      requirementId: item.requirementId || item.id || item._id,
      exhibitorId: item.exhibitorId,
      stallNumber: item.stallNumber || item.stall?.number,
      companyName: item.companyName || item.exhibitor?.companyName || 'Unknown Company',
      contactPerson: item.contactPerson || item.exhibitor?.name || 'Unknown',
      email: item.email || item.exhibitor?.email || 'unknown@email.com',
      phone: item.phone || item.exhibitor?.phone || 'N/A',
      status: item.status || 'pending',
      submittedAt: item.submittedAt || item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      notes: item.notes || '',
      items: item.items || item.requirements || [],
      metadata: item.metadata || {}
    }));
  };

  const generateMockRequirements = (): Requirement[] => {
    const mockItems = [
      { id: '1', type: 'Furniture', quantity: 2, description: 'Executive Chairs' },
      { id: '2', type: 'AV & IT Rentals', quantity: 1, description: 'Projector with Screen' },
      { id: '3', type: 'Electrical Load', quantity: 3, description: '15 AMP sockets' },
      { id: '4', type: 'Hostess Rates', quantity: 2, description: 'Hostess for 2 days' },
      { id: '5', type: 'Compressed Air', quantity: 1, description: 'Air connection' },
      { id: '6', type: 'Water Connection', quantity: 1, description: 'Water supply' },
      { id: '7', type: 'Security Guard', quantity: 2, description: 'Security personnel' },
      { id: '8', type: 'Housekeeping', quantity: 1, description: 'Daily cleaning' },
    ];

    const companies = [
      'Tech Solutions Pvt Ltd', 'Global Enterprises', 'Innovation Labs', 
      'Smart Systems Inc', 'Future Tech', 'Digital Dreams'
    ];

    const names = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh'];
    const statuses: ('pending' | 'approved' | 'rejected' | 'completed')[] = ['pending', 'approved', 'rejected', 'completed'];

    return Array.from({ length: 15 }, (_, i) => {
      const randomItems = mockItems.slice(0, Math.floor(Math.random() * 5) + 1);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: `req_${i + 1}`,
        requirementId: `REQ-${2024}-${String(i + 1).padStart(4, '0')}`,
        exhibitorId: `exh_${i + 1}`,
        stallNumber: `Stall ${Math.floor(Math.random() * 50) + 1}`,
        companyName: companies[Math.floor(Math.random() * companies.length)],
        contactPerson: names[Math.floor(Math.random() * names.length)],
        email: `exhibitor${i + 1}@example.com`,
        phone: `+91-98765-${String(43210 + i).slice(-5)}`,
        status: status,
        submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: Math.random() > 0.7 ? 'Special requirements for booth setup' : '',
        items: randomItems.map(item => ({
          ...item,
          description: `${item.description} - ${item.type}`
        })),
        metadata: {
          boothArea: `${Math.floor(Math.random() * 100) + 20} sqm`,
          eventName: 'DiemEx 2024',
          eventDate: new Date(2024, 11, 15).toISOString()
        }
      };
    });
  };

  const updateStats = (data: Requirement[]) => {
    setStats({
      total: data.length,
      pending: data.filter(req => req.status === 'pending').length,
      approved: data.filter(req => req.status === 'approved').length,
      rejected: data.filter(req => req.status === 'rejected').length,
      completed: data.filter(req => req.status === 'completed').length
    });
  };

  const filterRequirements = () => {
    let filtered = [...requirements];
    
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.stallNumber && req.stallNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        req.requirementId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    setFilteredRequirements(filtered);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    const icons: Record<string, React.ReactElement> = {
      pending: <ClockIcon className="h-3 w-3" />,
      approved: <CheckCircleIcon className="h-3 w-3" />,
      rejected: <XCircleIcon className="h-3 w-3" />,
      completed: <CheckCircleIcon className="h-3 w-3" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badges[status] || badges.pending}`}>
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getItemIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      'furniture': <SofaIcon className="h-4 w-4" />,
      'av & it rentals': <MonitorIcon className="h-4 w-4" />,
      'av': <MonitorIcon className="h-4 w-4" />,
      'electrical load': <ZapIcon className="h-4 w-4" />,
      'electrical': <ZapIcon className="h-4 w-4" />,
      'hostess rates': <SparklesIcon className="h-4 w-4" />,
      'hostess': <SparklesIcon className="h-4 w-4" />,
      'compressed air': <CableIcon className="h-4 w-4" />,
      'water connection': <DropletIcon className="h-4 w-4" />,
      'water': <DropletIcon className="h-4 w-4" />,
      'security guard': <ShieldCheckIcon className="h-4 w-4" />,
      'security': <ShieldCheckIcon className="h-4 w-4" />,
      'housekeeping': <SparklesIcon className="h-4 w-4" />
    };
    return icons[type.toLowerCase()] || <WrenchIcon className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequirements = filteredRequirements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const refreshData = () => {
    fetchRequirements();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Received Requirements</h1>
            <p className="text-gray-600 mt-1">View all extra requirements submitted by exhibitors</p>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <PackageIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company, contact person, stall number, or requirement ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredRequirements.length === 0 ? (
            <div className="text-center py-12">
              <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements found</h3>
              <p className="text-gray-500">
                {requirements.length === 0 
                  ? "No extra requirements have been submitted yet."
                  : "No requirements match your search criteria."}
              </p>
            </div>
          ) : (
            <Fragment>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requirement ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company / Stall
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items Required
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRequirements.map((requirement) => (
                      <tr key={requirement.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {requirement.requirementId.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {requirement.id.substring(0, 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {requirement.companyName}
                          </div>
                          {requirement.stallNumber && (
                            <div className="text-xs text-gray-500 mt-1">
                              Stall: {requirement.stallNumber}
                            </div>
                          )}
                          {requirement.metadata?.boothArea && (
                            <div className="text-xs text-gray-400">
                              Area: {requirement.metadata.boothArea}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {requirement.contactPerson}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <EnvelopeIcon className="h-3 w-3" />
                            {requirement.email}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <PhoneIcon className="h-3 w-3" />
                            {requirement.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {requirement.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                                {getItemIcon(item.type)}
                                <span>{item.type}</span>
                                {item.quantity > 1 && <span>({item.quantity})</span>}
                              </div>
                            ))}
                            {requirement.items.length > 3 && (
                              <span className="text-xs text-gray-500">+{requirement.items.length - 3} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(requirement.submittedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(requirement.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/received/${requirement.id}`}
                            className="text-blue-600 hover:text-blue-900 transition inline-flex items-center gap-1"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="text-xs">View</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </Fragment>
          )}
        </div>

        {/* Summary Section */}
        {filteredRequirements.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-xl p-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-sm text-blue-700">Showing {currentRequirements.length} of {filteredRequirements.length} requirements</p>
                {searchTerm && (
                  <p className="text-xs text-blue-600 mt-1">
                    Filtered by: &quot;{searchTerm}&quot; {statusFilter !== 'all' && `• Status: ${statusFilter}`}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700">Total Items Requested</p>
                <p className="text-lg font-bold text-blue-800">
                  {filteredRequirements.reduce((sum, req) => sum + req.items.length, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}