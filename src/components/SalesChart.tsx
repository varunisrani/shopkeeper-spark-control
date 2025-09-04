
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useSalesChart } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { formatIndianCurrency } from '@/lib/calculations';
import { AlertTriangle, Package } from 'lucide-react';

const SalesChart = () => {
  const { data, isLoading, error, isError } = useSalesChart();

  // Enhanced loading state
  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
        <div className="mb-4 sm:mb-6">
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mb-2" />
          <Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
        </div>
        <Skeleton className="h-48 sm:h-64 lg:h-80 w-full" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Sales Overview</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Compare sales and profit margins over time</p>
        </div>
        <div className="h-48 sm:h-64 lg:h-80 flex flex-col items-center justify-center text-slate-500">
          <AlertTriangle className="w-12 h-12 mb-2 text-amber-500" />
          <p className="text-sm font-medium">Unable to load chart data</p>
          <p className="text-xs text-slate-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Sales Overview</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Compare sales and profit margins over time</p>
        </div>
        <div className="h-48 sm:h-64 lg:h-80 flex flex-col items-center justify-center text-slate-500">
          <Package className="w-12 h-12 mb-2 text-slate-400" />
          <p className="text-sm font-medium">No sales data available</p>
          <p className="text-xs text-slate-400">Start recording sales to see your chart</p>
        </div>
      </div>
    );
  }

  // Data validation - check for profit calculation issues
  const hasNoProfitData = data.every(item => item.profit === 0);
  
  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-800 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span 
                className="flex items-center text-sm"
                style={{ color: entry.color }}
              >
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                {entry.dataKey === 'sales' ? 'Sales' : 'Profit'}:
              </span>
              <span className="font-medium text-slate-900">
                {formatIndianCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Sales Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {hasNoProfitData 
                ? 'Sales data available - profit calculation requires inventory data' 
                : 'Compare sales and actual profit margins over time'
              }
            </p>
          </div>
          {hasNoProfitData && (
            <div className="text-amber-500" title="Profit data unavailable">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
      <div className="h-48 sm:h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#64748b' }}
              stroke="#cbd5e1"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#64748b' }}
              stroke="#cbd5e1"
              tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            {!hasNoProfitData && (
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {hasNoProfitData && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Profit data unavailable</p>
              <p className="text-xs text-amber-700 mt-1">
                Profit calculations require inventory data. Check your database relationships between sales and inventory tables.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
