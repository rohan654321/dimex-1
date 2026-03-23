// app/admin/extra-requirements/received/[id]/page.tsx
'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  WrenchIcon,

  SparklesIcon,

  ShieldCheckIcon,

  UserIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  PrinterIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { SofaIcon, MonitorIcon, ZapIcon, CableIcon, DropletIcon, PackageIcon } from 'lucide-react';

const API_BASE_URL = 'https://diemex-backend.onrender.com';

interface RequirementItem {
  id: string;
  type: string;
  quantity: number;
  description: string;
  specifications?: string;
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
  adminNotes?: string;
  items: RequirementItem[];
  metadata?: {
    boothArea?: string;
    boothLocation?: string;
    eventName?: string;
    eventDate?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export default function AdminRequirementDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const requirementId = params.id as string;
  
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    adminNotes: ''
  });

  useEffect(() => {
    fetchRequirementDetails();
  }, [requirementId]);

  const fetchRequirementDetails = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      
      if (!token) {
        setError('Please login to view requirements');
        router.push('/admin/login');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/extra-requirements/${requirementId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequirement(data.data);
        setEditData({
          status: data.data.status,
          adminNotes: data.data.adminNotes || ''
        });
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      } else if (response.status === 404) {
        setError('Requirement not found');
      } else {
        setError('Failed to load requirement details');
      }
    } catch (error) {
      console.error('Error fetching requirement:', error);
      setError('Failed to load requirement details');
    } finally {
      setLoading(false);
    }
  };

  const updateRequirementStatus = async () => {
    if (!requirement?.id) return;
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/extra-requirements/admin/${requirement.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editData.status,
          adminNotes: editData.adminNotes
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequirement(data.data);
        setShowEditModal(false);
        alert('Requirement updated successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update requirement');
      }
    } catch (error) {
      console.error('Error updating requirement:', error);
      alert('Failed to update requirement');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    const icons: Record<string, React.ReactElement> = {
      pending: <ClockIcon className="h-4 w-4" />,
      approved: <CheckCircleIcon className="h-4 w-4" />,
      rejected: <XCircleIcon className="h-4 w-4" />,
      completed: <CheckCircleIcon className="h-4 w-4" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badges[status] || badges.pending}`}>
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getItemIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      'furniture': <SofaIcon className="h-5 w-5" />,
      'av & it rentals': <MonitorIcon className="h-5 w-5" />,
      'av': <MonitorIcon className="h-5 w-5" />,
      'electrical load': <ZapIcon className="h-5 w-5" />,
      'electrical': <ZapIcon className="h-5 w-5" />,
      'hostess rates': <SparklesIcon className="h-5 w-5" />,
      'hostess': <SparklesIcon className="h-5 w-5" />,
      'compressed air': <CableIcon className="h-5 w-5" />,
      'water connection': <DropletIcon className="h-5 w-5" />,
      'water': <DropletIcon className="h-5 w-5" />,
      'security guard': <ShieldCheckIcon className="h-5 w-5" />,
      'security': <ShieldCheckIcon className="h-5 w-5" />,
      'housekeeping': <SparklesIcon className="h-5 w-5" />
    };
    return icons[type.toLowerCase()] || <WrenchIcon className="h-5 w-5" />;
  };

  const getItemTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'furniture': 'Furniture',
      'av & it rentals': 'AV & IT Rentals',
      'av': 'AV & IT Rentals',
      'electrical load': 'Electrical Load',
      'electrical': 'Electrical Load',
      'hostess rates': 'Hostess Services',
      'hostess': 'Hostess Services',
      'compressed air': 'Compressed Air',
      'water connection': 'Water Connection',
      'water': 'Water Connection',
      'security guard': 'Security Guard',
      'security': 'Security Guard',
      'housekeeping': 'Housekeeping'
    };
    return labels[type.toLowerCase()] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requirement details...</p>
        </div>
      </div>
    );
  }

  if (error || !requirement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error || 'Requirement Not Found'}</h2>
          <p className="text-gray-600 mb-6">The requirement you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/received"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Requirements
          </Link>
        </div>
      </div>
    );
  }

  const exhibitorDetails = requirement;
  const metadata = requirement.metadata || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header with Back Button and Actions */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/admin/received"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Requirements
          </Link>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Update Status
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Requirement Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-sm text-blue-100">REQUIREMENT REQUEST</p>
                <h1 className="text-2xl font-bold text-white">#{requirement.requirementId.substring(0, 12)}</h1>
                <p className="text-blue-100 text-sm mt-1">
                  Submitted on {formatDate(requirement.submittedAt)}
                </p>
              </div>
              <div>
                {getStatusBadge(requirement.status)}
              </div>
            </div>
          </div>

          {/* Exhibitor Information */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
              Exhibitor Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Company Name</p>
                <p className="text-sm font-medium text-gray-900">{requirement.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Stall Number</p>
                <p className="text-sm font-medium text-gray-900">{requirement.stallNumber || 'Not Assigned Yet'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  Contact Person
                </p>
                <p className="text-sm font-medium text-gray-900">{requirement.contactPerson}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <EnvelopeIcon className="h-3 w-3" />
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900">{requirement.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <PhoneIcon className="h-3 w-3" />
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-900">{requirement.phone}</p>
              </div>
              {metadata.boothArea && (
                <div>
                  <p className="text-xs text-gray-500">Booth Area</p>
                  <p className="text-sm font-medium text-gray-900">{metadata.boothArea} sqm</p>
                </div>
              )}
            </div>
          </div>

          {/* Event Information */}
          {(metadata.eventName || metadata.eventDate || metadata.address) && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                Event Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metadata.eventName && (
                  <div>
                    <p className="text-xs text-gray-500">Event Name</p>
                    <p className="text-sm font-medium text-gray-900">{metadata.eventName}</p>
                  </div>
                )}
                {metadata.eventDate && (
                  <div>
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(metadata.eventDate)}</p>
                  </div>
                )}
                {metadata.address && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      Venue Address
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {metadata.address}
                      {metadata.city && `, ${metadata.city}`}
                      {metadata.state && `, ${metadata.state}`}
                      {metadata.pincode && ` - ${metadata.pincode}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items Required */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <PackageIcon className="h-4 w-4 text-blue-600" />
              Items Required
            </h3>
            <div className="space-y-3">
              {requirement.items.map((item, index) => (
                <div key={item.id || index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {getItemTypeLabel(item.type)}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          {item.specifications && (
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">Specifications:</span> {item.specifications}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            <TagIcon className="h-3 w-3" />
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {requirement.items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <WrenchIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No items specified</p>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ClipboardDocumentListIcon className="h-4 w-4 text-blue-600" />
              Notes
            </h3>
            
            {requirement.notes && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Exhibitor Notes:</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  {requirement.notes}
                </div>
              </div>
            )}
            
            {requirement.adminNotes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Admin Notes:</p>
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 border border-blue-200">
                  {requirement.adminNotes}
                </div>
              </div>
            )}
            
            {!requirement.notes && !requirement.adminNotes && (
              <p className="text-sm text-gray-500 italic">No notes added</p>
            )}
          </div>

          {/* Timeline Information */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-400">
            <div className="flex justify-between flex-wrap gap-2">
              <span>Requirement ID: {requirement.requirementId}</span>
              <span>Last Updated: {formatDate(requirement.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Edit Status Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Update Requirement Status</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <textarea
                    value={editData.adminNotes}
                    onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about this requirement (e.g., approval details, delivery instructions, etc.)..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateRequirementStatus}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {updating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <CheckIcon className="h-4 w-4" />
                  )}
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}