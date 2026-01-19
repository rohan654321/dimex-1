// app/dashboard/page.tsx
import EnhancedStatsCard, {
  EnhancedStatsCardProps,
} from "./components/EnhancedStatsCard";
import RecentActivity from "./components/RecentActivity";
import QuickActions from "./components/QuickActions";

import {
  BuildingStorefrontIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function EnhancedDashboardPage() {
  const stats: EnhancedStatsCardProps[] = [
    {
      title: "Company Profile",
      value: "Complete",
      change: "+100%",
      icon: BuildingStorefrontIcon,
      color: "from-green-500 to-emerald-600",
      trend: "up",
      href: "/dashboard/profile",
    },
    {
      title: "Stall Location",
      value: "A-12",
      change: "Premium Stall",
      icon: MapPinIcon,
      color: "from-blue-500 to-cyan-600",
      trend: "stable",
      href: "/dashboard/layout",
    },
    {
      title: "Total Investment",
      value: "$4,500",
      change: "Fully Paid",
      icon: CurrencyDollarIcon,
      color: "from-purple-500 to-violet-600",
      trend: "up",
      href: "/dashboard/invoice",
    },
    {
      title: "Requirements",
      value: "3 Pending",
      change: "Needs Review",
      icon: DocumentCheckIcon,
      color: "from-amber-500 to-orange-600",
      trend: "warning",
      href: "/dashboard/requirements",
    },
  ];

  const upcomingEvents = [
    { id: 1, title: "Setup Day", date: "Jan 28, 2024", time: "8:00 AM", type: "setup" },
    { id: 2, title: "Exhibition Opening", date: "Jan 29, 2024", time: "9:00 AM", type: "event" },
    { id: 3, title: "Networking Dinner", date: "Jan 30, 2024", time: "7:00 PM", type: "social" },
  ];

  const resourceUsage = [
    { label: "Stall Space", value: 100, max: 100, color: "bg-blue-500" },
    { label: "Power Load", value: 65, max: 100, color: "bg-green-500" },
    { label: "Storage", value: 30, max: 100, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, Tech Innovations!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your exhibition today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
            <CalendarIcon className="h-4 w-4" />
            <span>Event starts in 12 days</span>
          </div>

          <button className="btn-primary flex items-center gap-2">
            <SparklesIcon className="h-4 w-4" />
            Quick Actions
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <EnhancedStatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Quick Actions</h2>
                <p className="section-subtitle">Common tasks and shortcuts</p>
              </div>
              <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
            </div>
            <QuickActions />
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Recent Activity</h2>
                <p className="section-subtitle">Latest updates</p>
              </div>
              <button className="text-sm font-medium text-blue-600">
                View All
              </button>
            </div>
            <RecentActivity />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="section-title mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="section-title mb-4">Resource Usage</h2>
            <div className="space-y-4">
              {resourceUsage.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{r.label}</span>
                    <span>{r.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${r.color}`}
                      style={{ width: `${(r.value / r.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm mb-4">
              Our support team is available 24/7.
            </p>
            <button className="btn-primary w-full">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
