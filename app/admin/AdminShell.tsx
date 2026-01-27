"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  DollarSign,
  Image as ImageIcon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Building,
  Shield,
  Bell,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    name: "Exhibition Management",
    icon: Building,
    subItems: [
      { name: "Exhibitors", href: "/admin/exhibition/exhibitors" },
      { name: "Floor Plans", href: "/admin/exhibition/floor-plans" },
      { name: "Exhibitor Manuals", href: "/admin/exhibition/manuals" },
    ],
  },
  {
    name: "Financial",
    icon: DollarSign,
    subItems: [
      { name: "Payments", href: "/admin/financial/payments" },
      { name: "Invoices", href: "/admin/financial/invoices" },
      { name: "Revenue", href: "/admin/financial/revenue" },
    ],
  },
  { name: "User Management", href: "/admin/users", icon: Users },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const [mobileOpenMenus, setMobileOpenMenus] = useState<Set<string>>(new Set());
  
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (sidebarOpen && !target.closest('#mobile-sidebar') && !target.closest('[data-menu-button]')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  // Redirect if not authenticated and not on login page
  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  const toggleMenu = (name: string, isMobile: boolean = false) => {
    if (isMobile) {
      const newSet = new Set(mobileOpenMenus);
      newSet.has(name) ? newSet.delete(name) : newSet.add(name);
      setMobileOpenMenus(newSet);
    } else {
      const newSet = new Set(openMenus);
      newSet.has(name) ? newSet.delete(name) : newSet.add(name);
      setOpenMenus(newSet);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  // Don't render anything while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated, don't render
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-5 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="ml-2 font-bold text-lg">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name, true)}
                    className="w-full flex items-center px-2 py-3 text-sm hover:bg-gray-100 rounded"
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                    <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${
                      mobileOpenMenus.has(item.name) ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {mobileOpenMenus.has(item.name) && (
                    <div className="pl-10 space-y-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.href}
                          onClick={() => handleNavigation(sub.href)}
                          className={`block w-full text-left py-2 text-sm hover:text-blue-600 rounded ${
                            pathname === sub.href ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleNavigation(item.href!)}
                  className={`w-full flex items-center px-2 py-3 text-sm hover:bg-gray-100 rounded ${
                    pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-red-600 py-2 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r">
        <div className="px-4 py-5 flex items-center">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="ml-2 font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name, false)}
                    className={`w-full flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded ${
                      openMenus.has(item.name) ? 'bg-gray-50' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                    <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${
                      openMenus.has(item.name) ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {openMenus.has(item.name) && (
                    <div className="pl-10 space-y-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.href}
                          onClick={() => router.push(sub.href)}
                          className={`block w-full text-left py-1 text-sm hover:text-blue-600 rounded ${
                            pathname === sub.href ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push(item.href!)}
                  className={`w-full flex items-center px-2 py-2 text-sm hover:bg-gray-100 rounded ${
                    pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-red-600 py-2 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="lg:pl-64">
        <header className="h-16 bg-white shadow flex items-center px-4 justify-between sticky top-0 z-40">
          <button
            data-menu-button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}