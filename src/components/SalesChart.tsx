
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useSalesChart } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

const SalesChart = () => {
  const { data, isLoading } = useSalesChart();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
        <div className="mb-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Sales Overview</h3>
        <p className="text-sm text-slate-600">Compare sales and profit margins over time</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#cbd5e1"
              tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            />
            <Tooltip 
              formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name === 'sales' ? 'Sales' : 'Profit']}
              labelStyle={{ color: '#1e293b' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
