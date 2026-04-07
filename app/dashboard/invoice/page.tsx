// app/dashboard/invoice/page.tsx
'use client';

import React, { useState, useEffect, Fragment, useCallback } from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReceiptPercentIcon,
  BuildingOfficeIcon,
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
  metadata?: {
    exhibitorInfo?: {
      companyName?: string;
    };
  };
}

export default function ExhibitorInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [printing, setPrinting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0
  });

  const fetchInvoices = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/invoices/my-invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data);
        setLastRefresh(new Date());
        
        // Calculate stats
        const statsData = {
          total: data.data.length,
          paid: data.data.filter((inv: Invoice) => inv.status === 'paid').length,
          pending: data.data.filter((inv: Invoice) => inv.status === 'pending').length,
          overdue: data.data.filter((inv: Invoice) => inv.status === 'overdue').length,
          totalAmount: data.data.reduce(
            (sum: number, inv: Invoice) => sum + Number(inv.amount || 0),
            0
          )
        };
        setStats(statsData);
      } else if (response.status === 401) {
        console.error('Unauthorized - Please login again');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh for pending invoices
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefreshEnabled && invoices.length > 0) {
      const hasPendingInvoices = invoices.some(inv => inv.status === 'pending');
      if (hasPendingInvoices) {
        // Refresh every 15 seconds if there are pending invoices
        interval = setInterval(() => {
          console.log('Auto-refreshing invoices...');
          fetchInvoices(true);
        }, 15000);
      } else {
        // Refresh every 60 seconds if all invoices are processed
        interval = setInterval(() => {
          console.log('Auto-refreshing invoices...');
          fetchInvoices(true);
        }, 60000);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshEnabled, invoices.length, invoices.map(i => i.status).join(','), fetchInvoices]);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, statusFilter, invoices]);

  const filterInvoices = () => {
    let filtered = [...invoices];
    
    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.company && inv.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (inv.metadata?.exhibitorInfo?.companyName && 
          inv.metadata.exhibitorInfo.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }
    
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  const downloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    setDownloading(invoiceId);
    try {
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    } finally {
      setDownloading(null);
    }
  };

  // Add print function
  const printInvoice = (invoiceId: string) => {
    setPrinting(invoiceId);
    try {
      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');
      const printUrl = `${API_BASE_URL}/api/invoices/${invoiceId}/print?token=${encodeURIComponent(token || '')}`;
      window.open(printUrl, '_blank');
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('Failed to print invoice');
    } finally {
      setPrinting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactElement }> = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircleIcon className="h-3.5 w-3.5" /> },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <ClockIcon className="h-3.5 w-3.5" /> },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: <ExclamationCircleIcon className="h-3.5 w-3.5" /> },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <DocumentTextIcon className="h-3.5 w-3.5" /> }
    };
    const config = badges[status] || badges.draft;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading your invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header with Refresh */}
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Invoices</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">View and download all your invoices</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchInvoices(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg shadow-sm border ${
                autoRefreshEnabled 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {autoRefreshEnabled ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
          </div>
        </div>

        {/* Last Refresh Indicator */}
        {autoRefreshEnabled && (
          <div className="mb-4 text-right text-xs text-gray-400">
            Last updated: {lastRefresh.toLocaleTimeString()}
            {invoices.some(inv => inv.status === 'pending') && (
              <span className="ml-2 text-yellow-600">● Auto-refreshing (pending payments)</span>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Invoices</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <DocumentTextIcon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Paid</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <CheckCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <ClockIcon className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Overdue</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <ExclamationCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-3 sm:p-4 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                <p className="text-lg sm:text-xl font-bold text-blue-600">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <ReceiptPercentIcon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by invoice number or company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="text-center py-12 sm:py-16">
              <DocumentTextIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {invoices.length === 0 
                  ? "Your invoices will appear here once you submit requirements."
                  : "No invoices match your search criteria."}
              </p>
              {invoices.length === 0 && (
                <Link
                  href="/dashboard/requirements"
                  className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                >
                  Submit Requirements
                </Link>
              )}
            </div>
          </div>
        ) : (
          <Fragment>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-600">
                            {invoice.invoiceNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {invoice.company || invoice.metadata?.exhibitorInfo?.companyName || '—'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(invoice.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4" />
                            {formatDate(invoice.issueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4" />
                            {formatDate(invoice.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/dashboard/invoice/${invoice.id}`}
                              className="text-gray-500 hover:text-gray-700 transition p-1"
                              title="View Details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => printInvoice(invoice.id)}
                              disabled={printing === invoice.id}
                              className="text-gray-500 hover:text-gray-700 transition p-1 disabled:opacity-50"
                              title="Print Invoice"
                            >
                              {printing === invoice.id ? (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              ) : (
                                <PrinterIcon className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber)}
                              disabled={downloading === invoice.id}
                              className="text-blue-600 hover:text-blue-800 transition p-1 disabled:opacity-50"
                              title="Download PDF"
                            >
                              {downloading === invoice.id ? (
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              ) : (
                                <ArrowDownTrayIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {currentInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Invoice #</p>
                      <p className="font-semibold text-blue-600">{invoice.invoiceNumber}</p>
                    </div>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Company</span>
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.company || invoice.metadata?.exhibitorInfo?.companyName || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Amount</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(invoice.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Issue Date</span>
                      <span className="text-sm text-gray-600">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Due Date</span>
                      <span className="text-sm text-gray-600">{formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Link
                      href={`/dashboard/invoice/${invoice.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Link>
                    <button
                      onClick={() => printInvoice(invoice.id)}
                      disabled={printing === invoice.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm disabled:opacity-50"
                    >
                      {printing === invoice.id ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <PrinterIcon className="h-4 w-4" />
                      )}
                      Print
                    </button>
                    <button
                      onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber)}
                      disabled={downloading === invoice.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
                    >
                      {downloading === invoice.id ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      )}
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center bg-white rounded-xl shadow-sm px-4 py-3">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <div className="hidden sm:flex gap-2">
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
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
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
                <span className="sm:hidden text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
}