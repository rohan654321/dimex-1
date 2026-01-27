"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Filter,
  Key,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useExhibitors } from "@/hooks/useExhibitors";
import { useExhibitorStats } from "@/hooks/useExhibitorStats";
import { useAuth } from "@/hooks/useAuth";
import {
  Exhibitor,
  ExhibitorStatus,
} from "@/lib/api/exhibitors";

/* =======================
   PAGE
======================= */
export default function ExhibitorsPage() {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | ExhibitorStatus
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  const {
    exhibitors,
    total,
    isLoading,
    deleteExhibitor,
    bulkUpdateStatus,
    exportExhibitors,
    updateExhibitor,
  } = useExhibitors({
    search: search || undefined,
    sector: selectedSector !== "all" ? selectedSector : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  const { stats: exhibitorStats, isLoading: statsLoading } =
    useExhibitorStats();

  const statuses: Array<"all" | ExhibitorStatus> = [
    "all",
    "active",
    "inactive",
    "pending",
    "approved",
    "rejected",
  ];

  // Define sectors array (you should fetch this from your API or define it statically)
  const [sectors, setSectors] = useState<string[]>(["all", "Technology", "Healthcare", "Finance", "Retail", "Manufacturing"]);

  // Calculate total pages
  const totalPages = Math.ceil(total / itemsPerPage);

  // Password visibility toggle
  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => prev === id ? null : id);
  };

  // Generate pagination numbers
  const generatePagination = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 4) {
        // Near the start
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  /* =======================
     HANDLERS
  ======================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exhibitor?")) return;

    setIsDeleting(id);
    try {
      await deleteExhibitor(id);
      toast.success("Exhibitor deleted successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: ExhibitorStatus
  ) => {
    try {
      await updateExhibitor(id, { status });
      toast.success("Status updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBulkStatusChange = async (status: ExhibitorStatus) => {
    if (!confirm(`Update all exhibitors to ${status}?`)) return;

    try {
      await bulkUpdateStatus(
        exhibitors.map((e) => e.id),
        status
      );
      toast.success("Bulk status updated");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting(true);
    try {
      await exportExhibitors(format);
      toast.success(`Exported as ${format}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  /* =======================
     HELPERS
  ======================= */
  const getStatusColor = (status: ExhibitorStatus) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "inactive":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ExhibitorStatus) => {
    switch (status) {
      case "active":
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  /* =======================
     RENDER
  ======================= */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exhibitors Management</h1>
          <p className="text-gray-600">
            Managing {total} exhibitors | Showing page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting || exhibitors.length === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export
            </button>
          </div>
          <button
            onClick={() => router.push('/admin/exhibition/exhibitors/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Exhibitor
          </button>
        </div>
      </div>

      {/* Stats */}
      {!statsLoading && exhibitorStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="shrink-0 rounded-md p-3 bg-blue-100">
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
              <div className="shrink-0 rounded-md p-3 bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exhibitorStats.byStatus?.find(s => s._id === 'active')?.count || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="shrink-0 rounded-md p-3 bg-yellow-100">
                <Loader2 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exhibitorStats.byStatus?.find(s => s._id === 'pending')?.count || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="shrink-0 rounded-md p-3 bg-purple-100">
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
                placeholder="Search by name, company, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector === 'all' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as "all" | ExhibitorStatus)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bulk Actions</label>
            <select
              onChange={(e) => handleBulkStatusChange(e.target.value as ExhibitorStatus)}
              defaultValue=""
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company & Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {search ? 'Try adjusting your search or filter.' : 'Start by adding your first exhibitor.'}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => router.push('/admin/exhibition/exhibitors/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Exhibitor
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                exhibitors.map((exhibitor) => (
                  <tr key={exhibitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {exhibitor.company?.charAt(0) || 'E'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {exhibitor.company || 'No company'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {exhibitor.name || 'No name'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {exhibitor.sector || 'No sector'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            <Mail className="inline h-3 w-3 mr-1" />
                            {exhibitor.email}
                          </div>
                          {exhibitor.phone && (
                            <div className="text-xs text-gray-400">
                              <Phone className="inline h-3 w-3 mr-1" />
                              {exhibitor.phone}
                            </div>
                          )}
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
                              className="text-blue-600 hover:text-blue-800 text-xs truncate block max-w-xs"
                            >
                              {exhibitor.website}
                            </a>
                          </div>
                        )}
                        {/* Removed address, city, and country since they don't exist in Exhibitor type */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(exhibitor.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exhibitor.status)}`}>
                          {exhibitor.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </div>
                      {exhibitor.status?.toLowerCase() === 'pending' && (
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleStatusChange(exhibitor.id, 'approved')}
                            className="text-xs text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(exhibitor.id, 'rejected')}
                            className="text-xs text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {exhibitor.password ? (
                        <div>
                          <button
                            onClick={() => togglePasswordVisibility(exhibitor.id)}
                            className="text-blue-600 hover:text-blue-900 text-xs flex items-center"
                          >
                            <Key className="h-3 w-3 mr-1" />
                            {showPassword === exhibitor.id ? (
                              <>
                                <span className="font-mono">{exhibitor.password}</span>
                                <EyeOff className="h-3 w-3 ml-1" />
                              </>
                            ) : (
                              <>
                                <span className="font-mono">••••••••</span>
                                <Eye className="h-3 w-3 ml-1" />
                              </>
                            )}
                          </button>
                          <div className="text-xs text-gray-500 mt-1">
                            {exhibitor.password.length} chars
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No password</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {exhibitor.registrationDate || exhibitor.createdAt ? (
                          new Date(exhibitor.registrationDate || exhibitor.createdAt!).toLocaleDateString()
                        ) : (
                          'Not available'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => router.push(`/admin/exhibition/exhibitors/${exhibitor.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/exhibition/exhibitors/${exhibitor.id}/edit`)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exhibitor.id)}
                          disabled={isDeleting === exhibitor.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
        {exhibitors.length > 0 && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, total)}
                  </span>{' '}
                  of <span className="font-medium">{total}</span> results
                </p>
              </div>
              
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {generatePagination().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
                      disabled={page === '...'}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
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