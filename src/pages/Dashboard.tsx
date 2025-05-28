
import React from 'react';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/DashboardStats';
import SalesChart from '@/components/SalesChart';
import RecentSales from '@/components/RecentSales';
import AddInventoryDialog from '@/components/AddInventoryDialog';
import RecordSaleDialog from '@/components/RecordSaleDialog';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Welcome back! Here's what's happening with your mobile shop today.</p>
          </div>
          <div className="flex space-x-3">
            <AddInventoryDialog />
            <RecordSaleDialog />
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
    </div>
  );
};

export default Dashboard;
