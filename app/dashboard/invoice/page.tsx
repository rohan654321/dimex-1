// app/dashboard/invoice/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PrinterIcon, EyeIcon, ArrowDownTrayIcon, ShareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
  exhibitorInfo: {
    name: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    gstNumber: string;
  };
  paymentDetails?: {
    transactionId: string;
    paymentMode: string;
    paymentDate: string;
  };
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices/my-invoices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch invoices');
      
      const data = await response.json();
      setInvoices(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .invoice-title { font-size: 20px; color: #34495e; margin-top: 10px; }
            .info-section { margin: 20px 0; display: flex; justify-content: space-between; }
            .bill-to { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { text-align: center; margin-top: 50px; color: #7f8c8d; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">Maxx Business Media Pvt. Ltd.</div>
            <div class="invoice-title">TAX INVOICE</div>
          </div>
          
          <div class="info-section">
            <div>
              <strong>Invoice No:</strong> ${invoice.invoiceNumber}<br>
              <strong>Date:</strong> ${format(new Date(invoice.issueDate), 'dd MMM yyyy')}<br>
              <strong>Due Date:</strong> ${format(new Date(invoice.dueDate), 'dd MMM yyyy')}
            </div>
            <div>
              <strong>Status:</strong> ${invoice.status.toUpperCase()}<br>
              <strong>Amount:</strong> ${formatCurrency(invoice.amount)}
            </div>
          </div>
          
          <div class="bill-to">
            <strong>Bill To:</strong><br>
            ${invoice.exhibitorInfo.companyName}<br>
            ${invoice.exhibitorInfo.name}<br>
            ${invoice.exhibitorInfo.address}<br>
            GST: ${invoice.exhibitorInfo.gstNumber}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td>${formatCurrency(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            Total Amount: ${formatCurrency(invoice.amount)}
          </div>
          
          <div class="footer">
            This is a computer-generated invoice. No signature required.
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async (invoice: Invoice) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          text: `Invoice for ${invoice.exhibitorInfo.companyName} - Total: ${formatCurrency(invoice.amount)}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Invoice ${invoice.invoiceNumber}\nCompany: ${invoice.exhibitorInfo.companyName}\nAmount: ${formatCurrency(invoice.amount)}\nStatus: ${invoice.status.toUpperCase()}`;
      await navigator.clipboard.writeText(shareText);
      alert('Invoice details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Invoices & Payments</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => window.location.href = '/dashboard/requirements'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Make New Payment
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.paidAmount, 0))}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-600">
            {formatCurrency(invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount - i.paidAmount), 0))}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-blue-600">{invoices.length}</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.issueDate), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.dueDate), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
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
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </PDFDownloadLink>
                      <button
                        onClick={() => handlePrint(invoice)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Print"
                      >
                        <PrinterIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShare(invoice)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Share"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Maxx Business Media Pvt. Ltd.</h2>
                <p className="text-gray-500">TAX INVOICE</p>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-500 mt-2">Issue Date</p>
                  <p>{format(new Date(selectedInvoice.issueDate), 'dd MMM yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p>{format(new Date(selectedInvoice.dueDate), 'dd MMM yyyy')}</p>
                  <p className="text-sm text-gray-500 mt-2">Status</p>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                    {selectedInvoice.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Bill To:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedInvoice.exhibitorInfo.companyName}</p>
                  <p>{selectedInvoice.exhibitorInfo.name}</p>
                  <p>{selectedInvoice.exhibitorInfo.address}</p>
                  <p>GST: {selectedInvoice.exhibitorInfo.gstNumber}</p>
                  <p>Email: {selectedInvoice.exhibitorInfo.email}</p>
                  <p>Phone: {selectedInvoice.exhibitorInfo.phone}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold">Subtotal</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(selectedInvoice.amount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold">GST (18%)</td>
                      <td className="px-4 py-3">{formatCurrency(selectedInvoice.amount * 0.18)}</td>
                    </tr>
                    <tr className="border-t-2">
                      <td colSpan={3} className="px-4 py-3 text-right font-bold text-lg">Total</td>
                      <td className="px-4 py-3 font-bold text-lg text-blue-600">{formatCurrency(selectedInvoice.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Details */}
              {selectedInvoice.paymentDetails && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-green-900 mb-2">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">Transaction ID:</p>
                    <p className="font-mono">{selectedInvoice.paymentDetails.transactionId}</p>
                    <p className="text-gray-600">Payment Mode:</p>
                    <p>{selectedInvoice.paymentDetails.paymentMode}</p>
                    <p className="text-gray-600">Payment Date:</p>
                    <p>{format(new Date(selectedInvoice.paymentDetails.paymentDate), 'dd MMM yyyy HH:mm')}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t">
                <p>This is a computer-generated invoice. No signature required.</p>
                <p className="mt-1">Thank you for your business!</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3 sticky bottom-0">
              <PDFDownloadLink
                document={<InvoicePDF invoice={selectedInvoice} />}
                fileName={`invoice-${selectedInvoice.invoiceNumber}.pdf`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Download PDF
              </PDFDownloadLink>
              <button
                onClick={() => handlePrint(selectedInvoice)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => handleShare(selectedInvoice)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 inline-flex items-center"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}