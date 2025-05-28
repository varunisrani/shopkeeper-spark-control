
import React from 'react';
import { useRecentSales } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

const RecentSales = () => {
  const { data: sales, isLoading } = useRecentSales();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Recent Sales</h3>
        <p className="text-sm text-slate-600">Latest transactions processed</p>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : (
          sales?.map((sale, index) => (
            <div key={index} className="flex items-center justify-between hover:bg-slate-50 p-3 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{sale.id}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{sale.name}</p>
                  <p className="text-xs text-slate-500">{sale.product}</p>
                </div>
              </div>
              <div className="text-sm font-bold text-emerald-600">{sale.amount}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentSales;
