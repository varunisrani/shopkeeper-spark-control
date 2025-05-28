
import React from 'react';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/DashboardStats';
import SalesChart from '@/components/SalesChart';
import RecentSales from '@/components/RecentSales';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Button className="bg-black hover:bg-gray-800 text-white">
            Add Inventory
          </Button>
          <Button variant="outline">
            Record Sale
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
