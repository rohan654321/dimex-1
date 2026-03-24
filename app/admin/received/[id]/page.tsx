// app/admin/extra-requirements/received/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
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
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { SofaIcon, MonitorIcon, ZapIcon, CableIcon, DropletIcon, PackageIcon, UsersIcon, WifiIcon, LightbulbIcon } from 'lucide-react';

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
        // Remove any cost/specifications that contain prices
        const cleanItems = (data.data.items || []).map((item: any) => ({
          ...item,
          specifications: item.specifications?.replace(/Cost: ₹[\d,]+/gi, '').replace(/Total: ₹[\d,]+/gi, '').trim() || item.specifications
        }));
        setRequirement({ ...data.data, items: cleanItems });
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

  const downloadAsHTML = () => {
    if (!requirement) return;
    
    const groupedItems = groupItemsByType(requirement.items);
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Requirement Details - ${requirement.requirementId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: white;
              padding: 40px;
              line-height: 1.5;
            }
            .container {
              max-width: 900px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #2563eb;
            }
            .header h1 {
              font-size: 28px;
              color: #1e293b;
              margin-bottom: 8px;
            }
            .header p {
              color: #64748b;
              font-size: 14px;
            }
            .section {
              margin-bottom: 32px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
              color: #2563eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
            .info-item {
              background: #f8fafc;
              padding: 12px;
              border-radius: 8px;
            }
            .info-label {
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              color: #64748b;
              letter-spacing: 0.5px;
            }
            .info-value {
              font-size: 15px;
              font-weight: 500;
              color: #0f172a;
              margin-top: 4px;
            }
            .items-group {
              background: #f8fafc;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 20px;
            }
            .group-header {
              font-size: 16px;
              font-weight: 600;
              color: #2563eb;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .item-list {
              margin-left: 24px;
            }
            .item-entry {
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .item-entry:last-child {
              border-bottom: none;
            }
            .item-desc {
              font-size: 14px;
              color: #334155;
            }
            .item-qty {
              font-size: 12px;
              background: #e2e8f0;
              padding: 2px 8px;
              border-radius: 20px;
              color: #475569;
            }
            .specs {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }
            .notes-box {
              background: #fef3c7;
              padding: 16px;
              border-radius: 12px;
              border-left: 4px solid #f59e0b;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 16px;
              border-radius: 50px;
              font-size: 13px;
              font-weight: 600;
            }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-approved { background: #d1fae5; color: #065f46; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .status-completed { background: #dbeafe; color: #1e40af; }
            .footer {
              margin-top: 48px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Extra Requirements Request</h1>
              <p>${requirement.requirementId}</p>
              <p>Submitted: ${formatDate(requirement.submittedAt)}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Exhibitor Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Company Name</div>
                  <div class="info-value">${requirement.companyName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Stall Number</div>
                  <div class="info-value">${requirement.stallNumber || 'Not Assigned'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Contact Person</div>
                  <div class="info-value">${requirement.contactPerson}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${requirement.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${requirement.phone}</div>
                </div>
                ${requirement.metadata?.boothArea ? `
                <div class="info-item">
                  <div class="info-label">Booth Area</div>
                  <div class="info-value">${requirement.metadata.boothArea}</div>
                </div>
                ` : ''}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Items Required</div>
              ${Object.entries(groupedItems).map(([type, items]) => `
                <div class="items-group">
                  <div class="group-header">📦 ${type}</div>
                  <div class="item-list">
                    ${items.map(item => `
                      <div class="item-entry">
                        <div>
                          <div class="item-desc">${item.description}</div>
                          ${item.specifications ? `<div class="specs">${item.specifications}</div>` : ''}
                        </div>
                        <div class="item-qty">x${item.quantity}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
            
            ${requirement.notes ? `
            <div class="section">
              <div class="section-title">Exhibitor Notes</div>
              <div class="notes-box">
                <p>${requirement.notes}</p>
              </div>
            </div>
            ` : ''}
            
            ${requirement.adminNotes ? `
            <div class="section">
              <div class="section-title">Admin Notes</div>
              <div class="notes-box" style="background: #dbeafe; border-left-color: #3b82f6;">
                <p>${requirement.adminNotes}</p>
              </div>
            </div>
            ` : ''}
            
            <div class="section">
              <div class="section-title">Status</div>
              <div>
                <span class="status-badge status-${requirement.status}">
                  ${requirement.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div class="footer">
              Generated on ${new Date().toLocaleString()}<br>
              DiemEx Event Management System
            </div>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([printContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `requirement_${requirement.requirementId}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200'
    };
    const icons: Record<string, React.ReactElement> = {
      pending: <ClockIcon className="h-4 w-4" />,
      approved: <CheckCircleIcon className="h-4 w-4" />,
      rejected: <XCircleIcon className="h-4 w-4" />,
      completed: <CheckCircleIcon className="h-4 w-4" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${badges[status] || badges.pending}`}>
        {icons[status] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getItemIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('furniture')) return <SofaIcon className="h-5 w-5" />;
    if (typeLower.includes('av') || typeLower.includes('it')) return <MonitorIcon className="h-5 w-5" />;
    if (typeLower.includes('electrical')) return <ZapIcon className="h-5 w-5" />;
    if (typeLower.includes('hostess')) return <UsersIcon className="h-5 w-5" />;
    if (typeLower.includes('air')) return <CableIcon className="h-5 w-5" />;
    if (typeLower.includes('water')) return <DropletIcon className="h-5 w-5" />;
    if (typeLower.includes('security')) return <ShieldCheckIcon className="h-5 w-5" />;
    if (typeLower.includes('internet') || typeLower.includes('wifi')) return <WifiIcon className="h-5 w-5" />;
    if (typeLower.includes('lighting')) return <LightbulbIcon className="h-5 w-5" />;
    return <WrenchIcon className="h-5 w-5" />;
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
      'housekeeping': 'Housekeeping',
      'internet': 'Internet & WiFi',
      'lighting': 'Lighting'
    };
    return labels[type.toLowerCase()] || type;
  };

  const groupItemsByType = (items: RequirementItem[]) => {
    const grouped: { [key: string]: RequirementItem[] } = {};
    items.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    });
    return grouped;
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
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error || 'Requirement Not Found'}</h2>
          <p className="text-gray-600 mb-6">The requirement you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/received"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Requirements
          </Link>
        </div>
      </div>
    );
  }

  const metadata = requirement.metadata || {};
  const groupedItems = groupItemsByType(requirement.items);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/admin/received"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Requirements
          </Link>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition shadow-sm"
            >
              <PencilIcon className="h-4 w-4" />
              Update Status
            </button>
            <button
              onClick={downloadAsHTML}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-200 transition shadow-sm"
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <p className="text-sm text-blue-100 font-medium">REQUIREMENT REQUEST</p>
                <h1 className="text-2xl font-bold text-white mt-1">{requirement.requirementId}</h1>
                <p className="text-blue-100 text-sm mt-2 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Submitted on {formatDate(requirement.submittedAt)}
                </p>
              </div>
              <div>
                {getStatusBadge(requirement.status)}
              </div>
            </div>
          </div>

          {/* Exhibitor Info */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
              Exhibitor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium">Company Name</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{requirement.companyName}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium">Stall Number</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{requirement.stallNumber || 'Not Assigned Yet'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  Contact Person
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{requirement.contactPerson}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <EnvelopeIcon className="h-3 w-3" />
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{requirement.email}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <PhoneIcon className="h-3 w-3" />
                  Phone
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{requirement.phone}</p>
              </div>
              {metadata.boothArea && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-medium">Booth Area</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{metadata.boothArea} sqm</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Required - Grouped */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <PackageIcon className="h-4 w-4 text-blue-600" />
              Items Required
            </h3>
            
            {Object.keys(groupedItems).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedItems).map(([type, items]) => (
                  <div key={type} className="bg-gray-50 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {getItemIcon(type)}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-base">
                        {getItemTypeLabel(type)}
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {items.map((item, index) => (
                        <div key={item.id || index} className="px-4 py-3 hover:bg-gray-100 transition">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{item.description}</p>
                              {item.specifications && (
                                <p className="text-xs text-gray-500 mt-1">{item.specifications}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 rounded-full">
                              <TagIcon className="h-3 w-3 text-blue-600" />
                              <span className="text-xs font-medium text-blue-700">x{item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <WrenchIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No items specified</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {(requirement.notes || requirement.adminNotes) && (
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <ClipboardDocumentListIcon className="h-4 w-4 text-blue-600" />
                Notes
              </h3>
              
              {requirement.notes && (
                <div className="mb-4 bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
                  <p className="text-xs text-amber-600 font-medium mb-1">Exhibitor Notes:</p>
                  <p className="text-sm text-gray-700">{requirement.notes}</p>
                </div>
              )}
              
              {requirement.adminNotes && (
                <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
                  <p className="text-xs text-blue-600 font-medium mb-1">Admin Notes:</p>
                  <p className="text-sm text-blue-800">{requirement.adminNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-400 flex justify-between flex-wrap gap-2">
            <span>Requirement ID: {requirement.requirementId}</span>
            <span>Last Updated: {formatDate(requirement.updatedAt)}</span>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center p-5 border-b">
                <h3 className="text-lg font-semibold">Update Status</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={editData.adminNotes}
                    onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about this requirement..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-5 border-t">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={updateRequirementStatus}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition"
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