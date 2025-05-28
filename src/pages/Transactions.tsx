
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Search, Filter, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTransactions } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';

const Transactions = () => {
  const { data: transactions, isLoading } = useTransactions();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sale':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'Purchase':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="bg-white rounded-lg border">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Transaction History
              </h1>
              <p className="text-slate-600 mt-1 text-lg">View all purchase and sale transactions</p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center space-x-2 hover:bg-slate-50 border-slate-300">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>

        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by product, customer, or transaction ID..."
              className="pl-10 border-slate-300 focus:border-blue-500 bg-white rounded-xl"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-xl px-4">
            <Filter className="w-4 h-4 text-slate-500" />
            <select className="bg-transparent text-sm focus:outline-none">
              <option>All Types</option>
              <option>Sale</option>
              <option>Purchase</option>
            </select>
          </div>
          <Button variant="outline" className="hover:bg-slate-50 border-slate-300 rounded-xl">Filters</Button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Supplier
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {transactions?.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded-lg">
                        {transaction.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {transaction.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {transaction.supplier}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
