// app/dashboard/page.tsx
import StatsCard from './components/StatsCard';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  DocumentCheckIcon 
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Profile Status',
      value: 'Complete',
      change: '+100%',
      icon: UserGroupIcon,
      color: 'bg-green-500',
      href: '/dashboard/profile'
    },
    {
      title: 'Stall Location',
      value: 'A-12',
      change: 'Premium',
      icon: MapPinIcon,
      color: 'bg-blue-500',
      href: '/dashboard/layout'
    },
    {
      title: 'Total Paid',
      value: '$4,500',
      change: 'Paid',
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
      href: '/dashboard/invoice'
    },
    {
      title: 'Requirements',
      value: '3 Pending',
      change: 'View All',
      icon: DocumentCheckIcon,
      color: 'bg-yellow-500',
      href: '/dashboard/requirements'
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Exhibitor Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
            Download Exhibitor Manual
          </button>
          <button className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
            View Stall Layout
          </button>
          <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
            Submit Extra Requirements
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <DocumentCheckIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Invoice Paid</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">$1,500</span>
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <MapPinIcon className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Stall Confirmed</p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600">A-12</span>
          </div>
        </div>
      </div>
    </div>
  );
}