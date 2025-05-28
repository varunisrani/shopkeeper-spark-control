
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';

const Inventory = () => {
  const inventory = [
    {
      brand: 'Apple',
      model: 'iPhone 13 Pro',
      variant: '256GB, Graphite',
      imei: '356789012345678',
      purchasePrice: '₹99,900',
      salePrice: '₹1,29,900',
      stock: 15,
      condition: 'New',
      battery: '100%',
      status: 'In Stock',
      profit: '₹30,000',
      margin: '23.1%',
      purchaseDate: '2023-05-01'
    },
    {
      brand: 'Samsung',
      model: 'Galaxy S22',
      variant: '128GB, Phantom Black',
      imei: '357890123456789',
      purchasePrice: '₹79,900',
      salePrice: '₹99,900',
      stock: 23,
      condition: 'New',
      battery: '100%',
      status: 'In Stock',
      profit: '₹20,000',
      margin: '20.0%',
      purchaseDate: '2023-05-02'
    },
    {
      brand: 'Google',
      model: 'Pixel 6',
      variant: '128GB, Stormy Black',
      imei: '358901234567890',
      purchasePrice: '₹69,900',
      salePrice: '₹89,900',
      stock: 8,
      condition: 'New',
      battery: '100%',
      status: 'In Stock',
      profit: '₹20,000',
      margin: '22.2%',
      purchaseDate: '2023-05-03'
    },
    {
      brand: 'OnePlus',
      model: '10 Pro',
      variant: '256GB, Emerald Forest',
      imei: '359012345678901',
      purchasePrice: '₹64,900',
      salePrice: '₹84,900',
      stock: 4,
      condition: 'New',
      battery: '100%',
      status: 'In Stock',
      profit: '₹20,000',
      margin: '23.6%',
      purchaseDate: '2023-05-04'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage all mobile phone inventory with detailed tracking</p>
        </div>
        <Button className="bg-black hover:bg-gray-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Inventory
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Filter by brand or model..."
            className="pl-10"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-md">
          <option>All Status</option>
          <option>In Stock</option>
          <option>Sold</option>
          <option>Low Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IMEI/Serial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.model}</div>
                      <div className="text-sm text-gray-500">{item.variant}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.imei}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.purchasePrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{item.condition}</div>
                      <div className="text-sm text-gray-500">Battery: {item.battery}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <Badge variant="secondary" className="bg-gray-900 text-white">
                        {item.status}
                      </Badge>
                      <div className="text-sm text-green-600">
                        Profit: {item.profit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Margin: {item.margin}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.purchaseDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-gray-400 hover:text-gray-600">
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
