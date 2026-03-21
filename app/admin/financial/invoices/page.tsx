// components/admin/AdminInvoices.tsx
"use client"
import { useState, useEffect } from 'react';
import { 
  PrinterIcon, EyeIcon, ArrowDownTrayIcon, ShareIcon, 
  StarIcon, FilmIcon, SunIcon 
} from '@heroicons/react/24/outline';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import { format } from 'date-fns';
import { DownloadIcon, SearchIcon, SendIcon } from 'lucide-react';

// Type definitions
interface ExhibitorInfo {
  companyName: string;
  email: string;
  name?: string;
  phone?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  exhibitorInfo: ExhibitorInfo;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InvoiceStats {
  totalAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalCount: number;
}

interface ApiResponse {
  data: {
    invoices: Invoice[];
  };
}

interface AdminInvoicesProps {
  apiBaseUrl: string;
}

// Error handling utilities
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: string }).message === 'string'
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export default function AdminInvoices({ apiBaseUrl }: AdminInvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [stats, setStats] = useState<InvoiceStats>({
    totalAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    totalCount: 0
  });

  useEffect(() => {
    fetchInvoices();
    fetchStats();
  }, [search, statusFilter]);

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        ...(search && { search }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await fetch(`${apiBaseUrl}/api/invoices/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch invoices');
      
      const data: ApiResponse = await response.json();
      setInvoices(data.data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/invoices/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', getErrorMessage(error));
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendEmail = async (invoice: Invoice): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/invoices/${invoice.id}/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: invoice.exhibitorInfo.email })
      });
      
      if (response.ok) {
        alert('Invoice sent successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send email');
      }
    } catch (error) {
      alert('Error sending invoice: ' + getErrorMessage(error));
    }
  };

  const handleBulkExport = (): void => {
    try {
      // Create CSV data
      const headers = ['Invoice No', 'Company', 'Amount', 'Status', 'Issue Date', 'Due Date'];
      const rows = invoices.map(inv => [
        inv.invoiceNumber,
        inv.exhibitorInfo.companyName,
        inv.amount,
        inv.status,
        format(new Date(inv.issueDate), 'yyyy-MM-dd'),
        format(new Date(inv.dueDate), 'yyyy-MM-dd')
      ]);
      
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoices-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting invoices:', getErrorMessage(error));
      alert('Failed to export invoices');
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/invoices/${invoice.id}/mark-paid`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        alert('Invoice marked as paid successfully!');
        fetchInvoices();
        fetchStats();
      } else {
        throw new Error('Failed to mark invoice as paid');
      }
    } catch (error) {
      alert('Error updating invoice: ' + getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
        <button
          onClick={handleBulkExport}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export All
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Overdue Amount</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.exhibitorInfo?.companyName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.issueDate), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <PDFDownloadLink
                        document={<InvoicePDF invoice={invoice} />}
                        fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                        className="text-gray-600 hover:text-gray-900"
                        title="Download PDF"
                      >
                        {({ loading }) => (
                          <ArrowDownTrayIcon className={`h-5 w-5 ${loading ? 'opacity-50' : ''}`} />
                        )}
                      </PDFDownloadLink>
                      <button
                        onClick={() => handleSendEmail(invoice)}
                        className="text-green-600 hover:text-green-900"
                        title="Send Email"
                      >
                        <SendIcon className="h-5 w-5" />
                      </button>
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(invoice)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Mark as Paid"
                        >
                          <StarIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {invoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No invoices found</p>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Invoice Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Invoice Number:</span> {selectedInvoice.invoiceNumber}</p>
                      <p><span className="text-gray-600">Issue Date:</span> {format(new Date(selectedInvoice.issueDate), 'dd MMM yyyy')}</p>
                      <p><span className="text-gray-600">Due Date:</span> {format(new Date(selectedInvoice.dueDate), 'dd MMM yyyy')}</p>
                      <p><span className="text-gray-600">Status:</span> 
                        <span className={`ml-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                          {selectedInvoice.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Exhibitor Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Company Name:</span> {selectedInvoice.exhibitorInfo.companyName}</p>
                      <p><span className="text-gray-600">Email:</span> {selectedInvoice.exhibitorInfo.email}</p>
                      {selectedInvoice.exhibitorInfo.name && (
                        <p><span className="text-gray-600">Contact Person:</span> {selectedInvoice.exhibitorInfo.name}</p>
                      )}
                      {selectedInvoice.exhibitorInfo.phone && (
                        <p><span className="text-gray-600">Phone:</span> {selectedInvoice.exhibitorInfo.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Invoice Items</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedInvoice.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">Total Amount:</td>
                            <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">{formatCurrency(selectedInvoice.amount)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {selectedInvoice.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-600">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <PDFDownloadLink
                    document={<InvoicePDF invoice={selectedInvoice} />}
                    fileName={`invoice-${selectedInvoice.invoiceNumber}.pdf`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {({ loading }) => (
                      <>
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        {loading ? 'Generating...' : 'Download PDF'}
                      </>
                    )}
                  </PDFDownloadLink>
                  <button
                    onClick={() => handleSendEmail(selectedInvoice)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <SendIcon className="h-4 w-4 mr-2" />
                    Send Email
                  </button>
                  {selectedInvoice.status !== 'paid' && (
                    <button
                      onClick={() => handleMarkAsPaid(selectedInvoice)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <StarIcon className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}