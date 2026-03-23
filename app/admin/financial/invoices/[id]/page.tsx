// app/admin/invoices/[id]/page.tsx
'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = 'https://diemex-backend.onrender.com';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  company?: string;
  exhibitorId?: string;
  notes?: string;
  items?: any[];
  metadata?: {
    requirementsId?: string;
    generatedAt?: string;
    exhibitorInfo?: {
      name?: string;
      companyName?: string;
      email?: string;
      phone?: string;
      mobile?: string;
      title?: string;
      firstName?: string;
      lastName?: string;
      gstNumber?: string;
      businessNature?: string;
    };
    paymentInfo?: {
      paymentMode?: string;
      transactionId?: string;
      transactionDate?: string;
      paidAmount?: number;
    };
    totals?: {
      servicesTotal?: number;
      gst?: number;
      deposit?: number;
      total?: number;
    };
  };
}

export default function AdminInvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      
      if (!token) {
        setError('Please login to view invoice');
        router.push('/admin/login');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.data);
        setEditData({
          status: data.data.status,
          notes: data.data.notes || ''
        });
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      } else if (response.status === 404) {
        setError('Invoice not found');
      } else {
        setError('Failed to load invoice details');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!invoice?.id) return;
    
    setDownloading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/invoices/${invoice.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoice.invoiceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const updateInvoiceStatus = async () => {
    if (!invoice?.id) return;
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/invoices/admin/${invoice.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editData.status,
          notes: editData.notes
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.data);
        setShowEditModal(false);
        alert('Invoice updated successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Failed to update invoice');
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
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    const icons: Record<string, React.ReactElement> = {
      paid: <CheckCircleIcon className="h-4 w-4" />,
      pending: <ClockIcon className="h-4 w-4" />,
      overdue: <ExclamationCircleIcon className="h-4 w-4" />,
      draft: <DocumentTextIcon className="h-4 w-4" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badges[status] || badges.draft}`}>
        {icons[status] || icons.draft}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error || 'Invoice Not Found'}</h2>
          <p className="text-gray-600 mb-6">The invoice you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/financial/invoices"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const exhibitorDetails = invoice.metadata?.exhibitorInfo || {};
  const paymentInfo = invoice.metadata?.paymentInfo || {};
  const totals = invoice.metadata?.totals || {};
  const items = invoice.items || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header with Back Button and Actions */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/admin/financial/invoices"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Invoices
          </Link>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Status
            </button>
            <button
              onClick={downloadInvoice}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {downloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <ArrowDownTrayIcon className="h-4 w-4" />
              )}
              Download PDF
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

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-sm text-blue-100">INVOICE</p>
                <h1 className="text-2xl font-bold text-white">{invoice.invoiceNumber}</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Total Amount</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(invoice.amount)}</p>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Issue Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Invoice ID</p>
                <p className="text-sm font-mono text-gray-900">{invoice.id.substring(0, 8)}...</p>
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
                <p className="text-sm font-medium text-gray-900">{exhibitorDetails.companyName || invoice.company || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact Person</p>
                <p className="text-sm font-medium text-gray-900">
                  {`${exhibitorDetails.title || ''} ${exhibitorDetails.firstName || ''} ${exhibitorDetails.lastName || ''}`.trim() || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <EnvelopeIcon className="h-3 w-3" />
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900">{exhibitorDetails.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <DevicePhoneMobileIcon className="h-3 w-3" />
                  Mobile
                </p>
                <p className="text-sm font-medium text-gray-900">{exhibitorDetails.phone || exhibitorDetails.mobile || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">GST Number</p>
                <p className="text-sm font-medium text-gray-900">{exhibitorDetails.gstNumber || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Business Nature</p>
                <p className="text-sm font-medium text-gray-900">{exhibitorDetails.businessNature || '—'}</p>
              </div>
            </div>
          </div>

          {/* Services Table */}
          {items && items.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Services & Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-3 py-2 text-center text-sm text-gray-600">{item.quantity || 1}</td>
                        <td className="px-3 py-2 text-right text-sm text-gray-600">{formatCurrency(item.unitPrice || 0)}</td>
                        <td className="px-3 py-2 text-right text-sm font-medium text-gray-900">{formatCurrency(item.total || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="max-w-xs ml-auto">
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(totals.servicesTotal || (invoice.amount - (totals.gst || 0) - (totals.deposit || 0)))}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-medium">{formatCurrency(totals.gst || (invoice.amount * 0.18))}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-t border-gray-200 mt-1 pt-2">
                <span className="text-gray-600">Security Deposit:</span>
                <span className="font-medium">{formatCurrency(totals.deposit || 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold py-2 border-t border-gray-300 mt-1">
                <span className="text-gray-900">Grand Total:</span>
                <span className="text-blue-600">{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {paymentInfo.transactionId && (
            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <p className="text-sm font-medium text-gray-900">{paymentInfo.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Mode</p>
                  <p className="text-sm font-medium text-gray-900">{paymentInfo.paymentMode || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transaction Date</p>
                  <p className="text-sm font-medium text-gray-900">{paymentInfo.transactionDate ? formatDate(paymentInfo.transactionDate) : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount Paid</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(paymentInfo.paidAmount || 0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="px-6 py-4 border-t border-gray-200 bg-yellow-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Created: {formatDateTime(invoice.metadata?.generatedAt || invoice.issueDate)}</span>
              <span>Requirements ID: {invoice.metadata?.requirementsId?.substring(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Instructions</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Please instruct the exhibitor to make the payment via bank transfer using the following details:</p>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p><strong>Account Name:</strong> Maxx Business Media Pvt. Ltd.</p>
              <p><strong>Account Number:</strong> 272605000632</p>
              <p><strong>IFSC Code:</strong> ICIC0002726</p>
              <p><strong>Bank:</strong> ICICI Bank, New Delhi</p>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Please ensure the exhibitor uses the Invoice Number <strong>{invoice.invoiceNumber}</strong> as reference when making the payment.
            </p>
          </div>
        </div>

        {/* Edit Status Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Update Invoice Status</h3>
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
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any notes about this invoice..."
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
                  onClick={updateInvoiceStatus}
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