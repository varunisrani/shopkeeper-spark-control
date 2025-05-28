
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Transactions = () => {
  const transactions = [
    {
      id: 'T001',
      date: '2023-05-15',
      type: 'Sale',
      product: 'iPhone 13 Pro',
      quantity: 1,
      amount: '₹1,29,900',
      customer: 'John Doe',
      supplier: '-'
    },
    {
      id: 'T002',
      date: '2023-05-14',
      type: 'Sale',
      product: 'Samsung Galaxy S22',
      quantity: 1,
      amount: '₹99,900',
      customer: 'Alice Smith',
      supplier: '-'
    },
    {
      id: 'T003',
      date: '2023-05-13',
      type: 'Purchase',
      product: 'iPhone 13 Pro',
      quantity: 5,
      amount: '₹4,99,500',
      customer: '-',
      supplier: 'Apple Inc.'
    },
    {
      id: 'T004',
      date: '2023-05-12',
      type: 'Sale',
      product: 'Google Pixel 6',
      quantity: 1,
      amount: '₹89,900',
      customer: 'Robert Johnson',
      supplier: '-'
    },
    {
      id: 'T005',
      date: '2023-05-11',
      type: 'Sale',
      product: 'OnePlus 10 Pro',
      quantity: 1,
      amount: '₹84,900',
      customer: 'Emily Brown',
      supplier: '-'
    },
    {
      id: 'T006',
      date: '2023-05-10',
      type: 'Purchase',
      product: 'Samsung Galaxy S22',
      quantity: 10,
      amount: '₹7,99,000',
      customer: '-',
      supplier: 'Samsung Electronics'
    },
    {
      id: 'T007',
      date: '2023-05-09',
      type: 'Sale',
      product: 'Xiaomi 12',
      quantity: 1,
      amount: '₹74,900',
      customer: 'Michael Wilson',
      supplier: '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">View all purchase and sale transactions</p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Filter by product..."
            className="pl-10"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-md">
          <option>All Types</option>
          <option>Sale</option>
          <option>Purchase</option>
        </select>
        <Button variant="outline">Columns</Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={transaction.type === 'Sale' ? 'default' : 'secondary'}
                      className={transaction.type === 'Sale' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}
                    >
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.supplier}
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

export default Transactions;
