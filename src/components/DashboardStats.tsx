
import React from 'react';
import { TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  loading?: boolean;
  gradient: string;
}

const StatCard = ({ title, value, change, icon, loading, gradient }: StatCardProps) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between">
      <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">{title}</p>
        {loading ? (
          <Skeleton className="h-6 sm:h-8 w-16 sm:w-24" />
        ) : (
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">{value}</p>
        )}
        {loading ? (
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-32" />
        ) : (
          <p className="text-xs sm:text-sm text-emerald-600 font-medium hidden sm:block">{change}</p>
        )}
      </div>
      <div className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl ${gradient} flex-shrink-0 ml-2`}>
        <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const statsData = [
    {
      title: 'Total Revenue',
      value: isLoading ? '₹0' : `₹${stats?.totalRevenue?.toLocaleString('en-IN') || '0'}`,
      change: '+20.1% from last month',
      icon: <TrendingUp className="w-full h-full" />,
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
    },
    {
      title: 'Total Sales',
      value: isLoading ? '0' : `${stats?.totalSales || 0}`,
      change: '+19% from last month',
      icon: <ShoppingCart className="w-full h-full" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Current Stock',
      value: isLoading ? '0' : `${stats?.currentStock || 0}`,
      change: '+7 added this week',
      icon: <Package className="w-full h-full" />,
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      title: 'Total Profit',
      value: isLoading ? '₹0' : `₹${stats?.totalProfit?.toLocaleString('en-IN') || '0'}`,
      change: '+15.2% from last month',
      icon: <DollarSign className="w-full h-full" />,
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} loading={isLoading} />
      ))}
    </div>
  );
};

export default DashboardStats;
