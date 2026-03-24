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
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { SofaIcon, MonitorIcon, ZapIcon, CableIcon, DropletIcon, PackageIcon, UsersIcon, WifiIcon, LightbulbIcon, CoffeeIcon } from 'lucide-react';

const API_BASE_URL = 'https://diemex-backend.onrender.com';

interface RequirementItem {
  id: string;
  type: string;
  quantity: number;
  description: string;
  specifications?: string;
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
        const mockData = generateMockRequirements();
        setRequirements(mockData);
        updateStats(mockData);
      }
      
    } catch (error) {
      console.error('Error fetching requirements:', error);
      const mockData = generateMockRequirements();
      setRequirements(mockData);
      updateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const transformRequirementsData = (data: any[]): Requirement[] => {
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
      items: (item.items || item.requirements || []).map((i: any, idx: number) => ({
        id: i.id || `${item.id}_item_${idx}`,
        type: i.type,
        quantity: i.quantity,
        description: i.description,
        specifications: i.specifications?.replace(/Cost: ₹[\d,]+/gi, '').replace(/Total: ₹[\d,]+/gi, '').trim() || i.specifications
      })),
      metadata: item.metadata || {}
    }));
  };

  const generateMockRequirements = (): Requirement[] => {
    const mockData = [
      {
        company: 'Aow Logistics',
        stall: 'A-101',
        contact: 'Rohan Mondal',
        email: 'mondalrohan201@gmail.com',
        phone: '8617461530',
        items: [
          { type: 'Furniture', description: 'Executive Chair', quantity: 2 },
          { type: 'Furniture', description: 'Conference Table', quantity: 1 },
          { type: 'AV & IT Rentals', description: 'Projector with Screen', quantity: 1 },
          { type: 'AV & IT Rentals', description: 'Wireless Microphones', quantity: 2 },
          { type: 'Electrical Load', description: '15 AMP Power Supply', quantity: 3 },
          { type: 'Hostess Services', description: 'Welcome Hostess', quantity: 2 },
          { type: 'Security', description: 'Security Guard Service', quantity: 2 },
          { type: 'Compressed Air', description: 'Compressed Air Connection', quantity: 1 },
          { type: 'Water Connection', description: 'Water Connection', quantity: 1 },
          { type: 'Housekeeping', description: 'Housekeeping Staff', quantity: 3 },
        ]
      },
      {
        company: 'Tech Innovations Ltd',
        stall: 'B-205',
        contact: 'Priya Sharma',
        email: 'priya@techinnovations.com',
        phone: '9876543210',
        items: [
          { type: 'Furniture', description: 'Reception Desk', quantity: 1 },
          { type: 'Furniture', description: 'Visitor Chairs', quantity: 4 },
          { type: 'AV & IT Rentals', description: '65" LED Display', quantity: 2 },
          { type: 'Electrical Load', description: 'High Power Connection', quantity: 2 },
          { type: 'Internet', description: 'Dedicated WiFi', quantity: 1 },
        ]
      },
      {
        company: 'Global Exports',
        stall: 'C-312',
        contact: 'Amit Patel',
        email: 'amit@globalexports.com',
        phone: '9988776655',
        items: [
          { type: 'Furniture', description: 'Display Shelves', quantity: 6 },
          { type: 'Furniture', description: 'Product Stands', quantity: 3 },
          { type: 'Lighting', description: 'LED Spot Lights', quantity: 8 },
          { type: 'Water Connection', description: 'Water Supply', quantity: 1 },
        ]
      }
    ];

    const statuses: ('pending' | 'approved' | 'rejected' | 'completed')[] = ['pending', 'approved', 'rejected', 'completed'];
    
    return mockData.map((data, i) => ({
      id: `req_${i + 1}`,
      requirementId: `REQ-2024-${String(i + 1).padStart(4, '0')}`,
      exhibitorId: `exh_${i + 1}`,
      stallNumber: data.stall,
      companyName: data.company,
      contactPerson: data.contact,
      email: data.email,
      phone: data.phone,
      status: statuses[i % statuses.length],
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      notes: '',
      items: data.items.map((item, idx) => ({
        id: `${i}_item_${idx}`,
        type: item.type,
        quantity: item.quantity,
        description: item.description,
        specifications: ''
      })),
      metadata: {
        boothArea: `${Math.floor(Math.random() * 100) + 20} sqm`,
        eventName: 'DiemEx 2024',
      }
    }));
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
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200'
    };
    const icons: Record<string, React.ReactElement> = {
      pending: <ClockIcon className="h-3 w-3" />,
      approved: <CheckCircleIcon className="h-3 w-3" />,
      rejected: <XCircleIcon className="h-3 w-3" />,
      completed: <CheckCircleIcon className="h-3 w-3" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badges[status] || badges.pending}`}>
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getItemIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('furniture')) return <SofaIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('av') || typeLower.includes('it')) return <MonitorIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('electrical')) return <ZapIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('hostess')) return <UsersIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('air')) return <CableIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('water')) return <DropletIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('security')) return <ShieldCheckIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('internet') || typeLower.includes('wifi')) return <WifiIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('lighting')) return <LightbulbIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('housekeeping')) return <SparklesIcon className="h-3.5 w-3.5" />;
    if (typeLower.includes('coffee')) return <CoffeeIcon className="h-3.5 w-3.5" />;
    return <WrenchIcon className="h-3.5 w-3.5" />;
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

  const groupAndCombineItems = (items: RequirementItem[]) => {
    const grouped: { [key: string]: { totalQuantity: number; items: RequirementItem[] } } = {};
    
    items.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = {
          totalQuantity: 0,
          items: []
        };
      }
      grouped[item.type].totalQuantity += item.quantity;
      grouped[item.type].items.push(item);
    });
    
    return grouped;
  };

  const downloadCSV = () => {
    const headers = [
      'Requirement ID',
      'Company Name',
      'Stall Number',
      'Contact Person',
      'Email',
      'Phone',
      'Status',
      'Submitted Date',
      'Items Required'
    ];

    const rows = filteredRequirements.map(req => [
      req.requirementId,
      req.companyName,
      req.stallNumber || 'N/A',
      req.contactPerson,
      req.email,
      req.phone,
      req.status,
      formatDate(req.submittedAt),
      req.items.map(item => `${item.type}: ${item.description} (x${item.quantity})`).join('; ')
    ]);

    const csvContent = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `requirements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequirements = filteredRequirements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const refreshData = () => fetchRequirements();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Received Requirements
            </h1>
            <p className="text-gray-500 mt-1">View and manage exhibitor extra requirements</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
            >
              <PrinterIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Print</span>
            </button>
            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition">
                <DocumentTextIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition">
                <ClockIcon className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Approved</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition">
                <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition">
                <XCircleIcon className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition">
                <PackageIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company, contact person, stall number, or requirement ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Requirements Cards View - Better UI than Table */}
        <div className="space-y-4">
          {filteredRequirements.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm text-center py-16">
              <PackageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements found</h3>
              <p className="text-gray-500">
                {requirements.length === 0 
                  ? "No extra requirements have been submitted yet."
                  : "No requirements match your search criteria."}
              </p>
            </div>
          ) : (
            currentRequirements.map((requirement) => {
              const groupedItems = groupAndCombineItems(requirement.items);
              return (
                <div key={requirement.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div>
                        <p className="text-xs text-blue-100 font-medium">REQUIREMENT ID</p>
                        <p className="text-lg font-bold text-white">{requirement.requirementId}</p>
                        <p className="text-xs text-blue-100 mt-1 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {formatDate(requirement.submittedAt)}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(requirement.status)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Company Info */}
                    <div className="flex flex-wrap gap-6 mb-6 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Company</p>
                        <p className="text-base font-semibold text-gray-900">{requirement.companyName}</p>
                      </div>
                      {requirement.stallNumber && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Stall</p>
                          <p className="text-base font-semibold text-gray-900">{requirement.stallNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Contact Person</p>
                        <p className="text-base font-semibold text-gray-900">{requirement.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Contact</p>
                        <p className="text-sm text-gray-700">{requirement.email}</p>
                        <p className="text-sm text-gray-700">{requirement.phone}</p>
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <PackageIcon className="h-4 w-4 text-blue-600" />
                        Items Required
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(groupedItems).map(([type, { items, totalQuantity }]) => (
                          <div key={type} className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                  {getItemIcon(type)}
                                </div>
                                <span className="text-sm font-semibold text-gray-800">{type}</span>
                              </div>
                              <span className="text-xs font-medium bg-white px-2 py-0.5 rounded-full text-blue-600 shadow-sm">
                                Total: {totalQuantity}
                              </span>
                            </div>
                            <div className="space-y-1 ml-7">
                              {items.map((item, idx) => (
                                <div key={item.id} className="text-xs text-gray-600 flex justify-between items-center">
                                  <span>• {item.description}</span>
                                  <span className="text-blue-500 font-medium">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes if any */}
                    {requirement.notes && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                        <p className="text-xs text-amber-600 font-medium mb-1">Notes:</p>
                        <p className="text-sm text-gray-700">{requirement.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
                      <Link
                        href={`/admin/received/${requirement.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition font-medium text-sm"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                    className={`w-8 h-8 text-sm font-medium rounded-lg transition ${
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}