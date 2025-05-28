
import React from 'react';
import { useRecentSales } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

const RecentSales = () => {
  const { data: sales, isLoading } = useRecentSales();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Recent Sales</h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">Latest transactions processed</p>
      </div>
      <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                </div>
              </div>
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
            </div>
          ))
        ) : (
          sales?.slice(0, 6).map((sale, index) => (
            <div key={index} className="flex items-center justify-between hover:bg-slate-50 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-white">{sale.id}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{sale.name}</p>
                  <p className="text-xs text-slate-500 truncate">{sale.product}</p>
                </div>
              </div>
              <div className="text-xs sm:text-sm font-bold text-emerald-600 flex-shrink-0 ml-2">{sale.amount}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentSales;
