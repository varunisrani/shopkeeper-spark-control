
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
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">Welcome back! Here's what's happening with your mobile shop today.</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <AddInventoryDialog />
            <RecordSaleDialog />
          </div>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="xl:col-span-2 order-2 xl:order-1">
            <SalesChart />
          </div>
          <div className="order-1 xl:order-2">
            <RecentSales />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
