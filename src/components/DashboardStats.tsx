
import React from 'react';
import { TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-sm text-green-600 mt-1">{change}</p>
      </div>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹45,23,189',
      change: '+20.1% from last month',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Total Sales',
      value: '+573',
      change: '+19% from last month',
      icon: <ShoppingCart className="w-6 h-6" />
    },
    {
      title: 'Current Stock',
      value: '246',
      change: '+7 added this week',
      icon: <Package className="w-6 h-6" />
    },
    {
      title: 'Total Profit',
      value: '₹12,45,678',
      change: '+15.2% from last month',
      icon: <DollarSign className="w-6 h-6" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
