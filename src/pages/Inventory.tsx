
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Package } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';
import AddInventoryDialog from '@/components/AddInventoryDialog';

const Inventory = () => {
  const { data: inventory, isLoading } = useInventory();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'Sold':
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Like New':
        return 'bg-emerald-100 text-emerald-800';
      case 'Good':
        return 'bg-amber-100 text-amber-800';
      case 'Fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-4 lg:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
              <Skeleton className="h-3 sm:h-4 w-64 sm:w-96 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4 sm:p-6 border-b border-slate-100 last:border-b-0">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Inventory Management
              </h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base lg:text-lg">Manage all mobile phone inventory with detailed tracking</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <AddInventoryDialog />
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by brand, model, or IMEI..."
              className="pl-10 border-slate-300 focus:border-blue-500 bg-white rounded-lg sm:rounded-xl"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl px-3 sm:px-4 h-10">
            <Filter className="w-4 h-4 text-slate-500" />
            <select className="bg-transparent text-sm focus:outline-none">
              <option>All Status</option>
              <option>In Stock</option>
              <option>Sold</option>
              <option>Low Stock</option>
            </select>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {inventory?.map((item) => {
            const profit = parseFloat(item.sale_price.toString()) - parseFloat(item.purchase_price.toString());
            const profitMargin = ((profit / parseFloat(item.purchase_price.toString())) * 100).toFixed(1);
            
            return (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.brand}</h3>
                    <p className="text-sm font-medium text-slate-700">{item.model}</p>
                    <p className="text-xs text-slate-500">{item.variant}</p>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">IMEI:</span>
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{item.imei}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Purchase:</span>
                    <span className="text-xs">₹{parseFloat(item.purchase_price.toString()).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Sale Price:</span>
                    <span className="text-xs font-bold">₹{parseFloat(item.sale_price.toString()).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className={getConditionColor(item.condition)}>
                      {item.condition}
                    </Badge>
                    <div className="text-right">
                      <div className="text-xs text-emerald-600 font-bold">
                        Profit: ₹{profit.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-500">
                        Margin: {profitMargin}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Device Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    IMEI
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status & Profit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {inventory?.map((item) => {
                  const profit = parseFloat(item.sale_price.toString()) - parseFloat(item.purchase_price.toString());
                  const profitMargin = ((profit / parseFloat(item.purchase_price.toString())) * 100).toFixed(1);
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.brand}</div>
                          <div className="text-sm font-medium text-slate-700">{item.model}</div>
                          <div className="text-xs text-slate-500">{item.variant}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">{item.imei}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-slate-600">
                            Buy: ₹{parseFloat(item.purchase_price.toString()).toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            Sell: ₹{parseFloat(item.sale_price.toString()).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <Badge variant="secondary" className={getConditionColor(item.condition)}>
                            {item.condition}
                          </Badge>
                          <div className="text-xs text-slate-500">
                            Battery: {item.battery_health}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <Badge variant="secondary" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <div className="text-sm text-emerald-600 font-bold">
                            Profit: ₹{profit.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-slate-500">
                            Margin: {profitMargin}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {new Date(item.purchase_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100">
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
    </div>
  );
};

export default Inventory;
