
import React from 'react';

const RecentSales = () => {
  const sales = [
    { id: 'JD', name: 'John Doe', product: 'iPhone 13 Pro', amount: '+₹1,29,900' },
    { id: 'AS', name: 'Alice Smith', product: 'Samsung Galaxy S22', amount: '+₹99,900' },
    { id: 'RJ', name: 'Robert Johnson', product: 'Google Pixel 6', amount: '+₹89,900' },
    { id: 'EB', name: 'Emily Brown', product: 'OnePlus 10 Pro', amount: '+₹84,900' },
    { id: 'MW', name: 'Michael Wilson', product: 'Xiaomi 12', amount: '+₹74,900' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
        <p className="text-sm text-gray-600">Latest transactions processed</p>
      </div>
      <div className="space-y-4">
        {sales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">{sale.id}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{sale.name}</p>
                <p className="text-sm text-gray-500">{sale.product}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">{sale.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSales;
