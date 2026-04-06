// app/dashboard/invoice/[id]/page.tsx
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
  PrinterIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = 'https://diemex-backend.onrender.com';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issueDate: string;
  dueDate: string;
  company?: string;
  exhibitorDetails?: any;
  boothDetails?: any;
  items?: any[];
  totals?: any;
  metadata?: {
    exhibitorInfo?: any;
    totals?: any;
  };
}

export default function ExhibitorInvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.data);
      } else if (response.status === 403) {
        setError('You do not have permission to view this invoice');
      } else if (response.status === 404) {
        setError('Invoice not found');
      } else {
        setError('Failed to load invoice details');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!invoice?.id) return;
    
    setDownloading(true);
    try {
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/invoices/${invoice.id}/download`, {
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
      }
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactElement }> = {
      paid: { color: 'bg-green-100 text-green-800', icon: <CheckCircleIcon className="h-4 w-4" /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <ClockIcon className="h-4 w-4" /> },
      overdue: { color: 'bg-red-100 text-red-800', icon: <ExclamationCircleIcon className="h-4 w-4" /> },
      draft: { color: 'bg-gray-100 text-gray-800', icon: <DocumentTextIcon className="h-4 w-4" /> }
    };
    const c = config[status] || config.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${c.color}`}>
        {c.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
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
          <Link href="/dashboard/invoice" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const exhibitor = invoice.exhibitorDetails || invoice.metadata?.exhibitorInfo || {};
  const booth = invoice.boothDetails || {};
  const items = invoice.items || [];
  const totals = invoice.totals || invoice.metadata?.totals || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <Link href="/dashboard/invoice" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Invoices
          </Link>
          <div className="flex gap-3">
            <button onClick={downloadInvoice} disabled={downloading} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {downloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <ArrowDownTrayIcon className="h-4 w-4" />
              )}
              Download PDF
            </button>
          <button
  onClick={() => {
    const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
    window.open(`${API_BASE_URL}/api/invoices/${invoice.id}/print?token=${encodeURIComponent(token || '')}`, '_blank');
  }}
  className="text-gray-600 hover:text-gray-900 transition"
  title="Print Invoice"
>
  <PrinterIcon className="h-5 w-5" />
</button>

          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
            <div className="flex justify-between items-center">
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
          <div className="px-6 py-4 border-b bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Issue Date</p>
              <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              {getStatusBadge(invoice.status)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Invoice ID</p>
              <p className="font-mono text-sm">{invoice.id.substring(0, 8)}...</p>
            </div>
          </div>

          {/* Exhibitor Info */}
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BuildingOfficeIcon className="h-4 w-4 text-blue-600" /> 
              Exhibitor Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Company</p>
                <p className="font-medium">{exhibitor.companyName || invoice.company || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Contact Person</p>
                <p className="font-medium">{`${exhibitor.title || ''} ${exhibitor.firstName || ''} ${exhibitor.lastName || ''}`.trim() || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <EnvelopeIcon className="h-3 w-3" /> Email
                </p>
                <p className="font-medium">{exhibitor.email || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <DevicePhoneMobileIcon className="h-3 w-3" /> Mobile
                </p>
                <p className="font-medium">{exhibitor.mobile || exhibitor.phone || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">GST Number</p>
                <p className="font-medium">{exhibitor.gstNumber || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Business Nature</p>
                <p className="font-medium">{exhibitor.businessNature || '—'}</p>
              </div>
            </div>
          </div>

          {/* Booth Info */}
          {booth.boothNo && (
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-700 mb-3">Booth Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Booth Number</p>
                  <p className="font-medium">{booth.boothNo || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Area Booked</p>
                  <p className="font-medium">{booth.sqMtrBooked ? `${booth.sqMtrBooked} sq.m` : '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Security Deposit</p>
                  <p className="font-medium">{formatCurrency(totals.deposit || 0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Services Table */}
          {items.length > 0 && (
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-700 mb-3">Services & Items</h3>
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
                    {items.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-sm">{item.description}</td>
                        <td className="px-3 py-2 text-center text-sm">{item.quantity || 1}</td>
                        <td className="px-3 py-2 text-right text-sm">{formatCurrency(item.unitPrice || 0)}</td>
                        <td className="px-3 py-2 text-right text-sm font-medium">{formatCurrency(item.total || 0)}</td>
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
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(totals.servicesTotal || (invoice.amount - (totals.gst || 0) - (totals.deposit || 0)))}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">GST (18%):</span>
                <span>{formatCurrency(totals.gst || (invoice.amount * 0.18))}</span>
              </div>
              <div className="flex justify-between py-1 border-t mt-1 pt-2">
                <span className="text-gray-600">Security Deposit:</span>
                <span>{formatCurrency(totals.deposit || 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-t font-bold">
                <span className="text-gray-900">Grand Total:</span>
                <span className="text-blue-600">{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}