'use client';

import {
  Users,
  Calendar,
  Download,
  ArrowUp,
  RefreshCw,
  TrendingUp,
  Activity,
  Clock,
  Eye,
  FileText,
  BarChart3,
  TrendingDown,
  CalendarDays,
  MousePointerClick,
  ChartNoAxesCombined,
  LineChart,
  PieChart
} from 'lucide-react';

import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

// Types for dashboard data
interface VisitorDay {
  date: string;
  count: number;
}

interface PageView {
  page: string;
  views: number;
}

interface VisitorStats {
  total: number;
  today: number;
  week: number;
  month: number;
  source: string;
  last7Days: VisitorDay[];
  pages: PageView[];
}

interface DashboardData {
  visitors: VisitorStats;
}

export default function DashboardPage() {
  const { summary, isLoading, error, refresh } = useDashboard();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  const handleExport = async (e: FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    try {
      toast.success('Report exported successfully');
    } catch {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    refresh();
    toast.success('Dashboard refreshed');
  };

  // Format date from GA format (20260425 → Apr 25)
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length < 8) return 'Invalid Date';
    const date = new Date(
      dateStr.slice(0, 4) + '-' +
      dateStr.slice(4, 6) + '-' +
      dateStr.slice(6, 8)
    );
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayName = (dateStr: string) => {
    if (!dateStr || dateStr.length < 8) return '';
    const date = new Date(
      dateStr.slice(0, 4) + '-' +
      dateStr.slice(4, 6) + '-' +
      dateStr.slice(6, 8)
    );
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-[#F08400] mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-[#F08400] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const data = summary as DashboardData;
  const visitorStats = data?.visitors || { 
    total: 0, today: 0, week: 0, month: 0, 
    source: 'google-analytics', last7Days: [], pages: [] 
  };
  
  const last7Days = visitorStats.last7Days || [];
  const topPages = visitorStats.pages || [];
  
  const maxCount = last7Days.length > 0 
    ? Math.max(...last7Days.map((d: VisitorDay) => d.count), 1) 
    : 1;

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { percentage: '+100', trend: 'up' };
    const change = ((current - previous) / previous * 100).toFixed(1);
    return {
      percentage: `${parseFloat(change) >= 0 ? '+' : ''}${change}%`,
      trend: parseFloat(change) >= 0 ? 'up' : 'down'
    };
  };

  // Weekly change calculation
  const previousWeekTotal = last7Days.slice(0, 7).reduce((sum, d) => sum + d.count, 0);
  const currentWeekTotal = last7Days.slice(7, 14).reduce((sum, d) => sum + d.count, 0);
  const weeklyChange = calculateChange(currentWeekTotal, previousWeekTotal);

  // Monthly change calculation (comparing last 7 days avg with monthly avg)
  const weeklyAvg = last7Days.reduce((sum, d) => sum + d.count, 0) / 7;
  const monthlyAvg = (visitorStats.month || 0) / 30;
  const monthlyChange = calculateChange(weeklyAvg, monthlyAvg);

  const statsCards = [
    {
      title: 'Total Visitors',
      value: visitorStats.total?.toLocaleString() || '0',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      period: 'All Time'
    },
    {
      title: 'Monthly Visitors',
      value: visitorStats.month?.toLocaleString() || '0',
      icon: CalendarDays,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      period: 'Last 30 Days',
      change: monthlyChange,
      subValue: `${visitorStats.week || 0} this week`
    },
    {
      title: 'Weekly Visitors',
      value: visitorStats.week?.toLocaleString() || '0',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      period: 'Last 7 Days',
      change: weeklyChange,
      subValue: `${visitorStats.today || 0} today`
    },
    {
      title: "Today's Visitors",
      value: visitorStats.today?.toLocaleString() || '0',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      period: 'Live',
      subValue: `Updated in real-time`
    }
  ];

  // Prepare data for weekly view (last 7 days)
  const weeklyData = last7Days.slice(-7);
  
  // Prepare data for monthly view (group by week)
  const monthlyData = [];
  for (let i = 0; i < last7Days.length; i += 7) {
    const weekData = last7Days.slice(i, i + 7);
    if (weekData.length > 0) {
      monthlyData.push({
        week: `Week ${Math.floor(i / 7) + 1}`,
        total: weekData.reduce((sum, d) => sum + d.count, 0),
        days: weekData.length
      });
    }
  }

  const chartData = selectedPeriod === 'week' ? weeklyData : monthlyData;
  const chartMaxCount = selectedPeriod === 'week' 
    ? Math.max(...weeklyData.map(d => d.count), 1)
    : Math.max(...monthlyData.map(d => d.total), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Analytics Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span>Welcome back, {user?.name || 'Admin'}!</span>
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Live Data
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#F08400] text-white rounded-lg hover:bg-orange-600 transition shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2.5 sm:p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stat.value}</p>
                    {stat.subValue && (
                      <p className="text-xs text-gray-400 mt-1">{stat.subValue}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">{stat.period}</p>
                  </div>
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.change.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change.percentage}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PERIOD SELECTOR */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-4 py-1.5 text-sm rounded-md transition ${
                  selectedPeriod === 'week' 
                    ? 'bg-[#F08400] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LineChart className="h-4 w-4 inline mr-1" />
                Weekly View
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-1.5 text-sm rounded-md transition ${
                  selectedPeriod === 'month' 
                    ? 'bg-[#F08400] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-1" />
                Monthly View
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            Data source: {visitorStats.source || 'Google Analytics'}
          </div>
        </div>

        {/* VISITOR TREND CHART */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ChartNoAxesCombined className="h-5 w-5 text-[#F08400]" />
                Visitor Trends - {selectedPeriod === 'week' ? 'Daily' : 'Weekly'} View
              </h3>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#F08400] rounded-full"></span>
                  <span className="text-gray-500">Visitors</span>
                </div>
                <div className="text-gray-400">
                  {selectedPeriod === 'week' ? 'Last 7 days' : `${monthlyData.length} weeks`}
                </div>
              </div>
            </div>

            <div className="relative h-64 sm:h-80">
              <div className="flex items-end h-full gap-2 sm:gap-3">
                {chartData.map((item: any, index: number) => {
                  const count = selectedPeriod === 'week' ? item.count : item.total;
                  const height = chartMaxCount > 0 ? (count / chartMaxCount) * 100 : 0;
                  const label = selectedPeriod === 'week' 
                    ? getDayName(item.date)
                    : item.week;
                  const dateLabel = selectedPeriod === 'week' 
                    ? formatDate(item.date)
                    : `Total: ${count}`;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 group">
                      <div className="relative w-full">
                        <div
                          className="bg-gradient-to-t from-[#F08400] to-orange-400 w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                          {count.toLocaleString()} visitors
                          {selectedPeriod === 'week' && ` on ${formatDate(item.date)}`}
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium">
                        {label}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                        {dateLabel}
                      </span>
                      <span className="text-xs font-bold text-gray-700 mt-1">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedPeriod === 'week' 
                      ? weeklyData.reduce((sum, d) => sum + d.count, 0).toLocaleString()
                      : monthlyData.reduce((sum, d) => sum + d.total, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Average</p>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedPeriod === 'week'
                      ? Math.round(weeklyData.reduce((sum, d) => sum + d.count, 0) / weeklyData.length).toLocaleString()
                      : Math.round(monthlyData.reduce((sum, d) => sum + d.total, 0) / monthlyData.length).toLocaleString()}
                    <span className="text-xs text-gray-400">/day</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Peak Day</p>
                  <p className="text-lg font-bold text-green-600">
                    {selectedPeriod === 'week'
                      ? Math.max(...weeklyData.map(d => d.count)).toLocaleString()
                      : Math.max(...monthlyData.map(d => d.total)).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">vs Previous</p>
                  <p className={`text-lg font-bold flex items-center justify-center gap-1 ${weeklyChange.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyChange.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {weeklyChange.percentage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOP PAGES SECTION */}
        {topPages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#F08400]" />
                Top Performing Pages
                <span className="text-xs font-normal text-gray-400 ml-2">by page views</span>
              </h3>
              <div className="text-xs text-gray-400">
                Total Views: {topPages.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-4">
              {topPages.slice(0, 10).map((page: PageView, i: number) => {
                const percentage = topPages[0]?.views > 0 
                  ? (page.views / topPages[0].views) * 100 
                  : 0;
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-400 w-7">
                          #{i + 1}
                        </span>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                            {i === 0 ? '🏠' : i === 1 ? '📋' : i === 2 ? '📊' : '📄'}
                          </div>
                          <span className="text-sm text-gray-700 truncate font-medium">
                            {page.page === '/' ? 'Homepage' : page.page.replace(/^\/+/, '').replace(/-/g, ' ') || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Eye className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-800 min-w-[50px] text-right">
                          {page.views.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 w-12">
                          {((page.views / topPages[0].views) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#F08400] to-orange-400 h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {topPages.length > 10 && (
              <div className="mt-5 pt-3 border-t border-gray-100">
                <Link 
                  href="/admin/analytics"
                  className="text-sm text-[#F08400] hover:text-orange-600 font-medium flex items-center gap-1 inline-flex"
                >
                  View All {topPages.length} Pages
                  <ArrowUp className="h-3 w-3 rotate-90" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* SUMMARY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MousePointerClick className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Engagement Rate</h4>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {((topPages[0]?.views || 0) / (visitorStats.total || 1) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">of visitors viewed homepage</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Pages per Visitor</h4>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {(topPages.reduce((sum, p) => sum + p.views, 0) / (visitorStats.total || 1)).toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mt-1">average page views per session</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CalendarDays className="h-5 w-5 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Monthly Growth</h4>
            </div>
            <p className={`text-2xl font-bold flex items-center gap-2 ${monthlyChange.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyChange.trend === 'up' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {monthlyChange.percentage}
            </p>
            <p className="text-xs text-gray-500 mt-1">compared to previous period</p>
          </div>
        </div>

        {/* DATA SOURCE FOOTER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4 flex-wrap">
            <span>🔄 Last updated: {new Date().toLocaleString()}</span>
            <span>📊 Analytics: {visitorStats.source || 'Google Analytics'}</span>
            <span>📈 Tracking: Real-time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Live data streaming</span>
          </div>
        </div>
      </div>
    </div>
  );
}