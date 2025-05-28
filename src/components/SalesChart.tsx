
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const SalesChart = () => {
  const data = [
    { name: 'Jan 1', sales: 400000, profit: 240000 },
    { name: 'Jan 5', sales: 300000, profit: 139000 },
    { name: 'Jan 10', sales: 200000, profit: 980000 },
    { name: 'Jan 15', sales: 278000, profit: 390000 },
    { name: 'Jan 20', sales: 189000, profit: 480000 },
    { name: 'Jan 25', sales: 239000, profit: 380000 },
    { name: 'Jan 30', sales: 349000, profit: 430000 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <p className="text-sm text-gray-600">Compare sales and profit margins over the last 30 days</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="sales" fill="#10b981" />
            <Bar dataKey="profit" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
