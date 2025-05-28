
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';
import AddInventoryDialog from '@/components/AddInventoryDialog';

const Inventory = () => {
  const { data: inventory, isLoading } = useInventory();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Sold':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Like New':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-6 border-b border-gray-100 last:border-b-0">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage all mobile phone inventory with detailed tracking</p>
        </div>
        <AddInventoryDialog />
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by brand, model, or IMEI..."
            className="pl-10 border-gray-200 focus:border-black"
          />
        </div>
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <select className="bg-transparent text-sm focus:outline-none">
            <option>All Status</option>
            <option>In Stock</option>
            <option>Sold</option>
            <option>Low Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Device Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IMEI
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status & Profit
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {inventory?.map((item) => {
                const profit = parseFloat(item.sale_price.toString()) - parseFloat(item.purchase_price.toString());
                const profitMargin = ((profit / parseFloat(item.purchase_price.toString())) * 100).toFixed(1);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{item.brand}</div>
                        <div className="text-sm font-medium text-gray-700">{item.model}</div>
                        <div className="text-xs text-gray-500">{item.variant}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">{item.imei}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          Buy: ₹{parseFloat(item.purchase_price.toString()).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          Sell: ₹{parseFloat(item.sale_price.toString()).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <Badge variant="secondary" className={getConditionColor(item.condition)}>
                          {item.condition}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          Battery: {item.battery_health}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <Badge variant="secondary" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <div className="text-sm text-green-600 font-medium">
                          Profit: ₹{profit.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Margin: {profitMargin}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(item.purchase_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="text-lg">⋯</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
