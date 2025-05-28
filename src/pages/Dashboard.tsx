
import React from 'react';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/DashboardStats';
import SalesChart from '@/components/SalesChart';
import RecentSales from '@/components/RecentSales';
import AddInventoryDialog from '@/components/AddInventoryDialog';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your mobile shop today.</p>
        </div>
        <div className="flex space-x-3">
          <AddInventoryDialog />
          <Button variant="outline" className="hover:bg-gray-50">
            Record Sale
          </Button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
