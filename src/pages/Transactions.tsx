
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-4 lg:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
              <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-20 sm:w-24" />
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-20 sm:w-24" />
          </div>
          <div className="bg-white rounded-lg border">
            <Skeleton className="h-64 sm:h-80 lg:h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg sm:rounded-xl">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Transaction History
              </h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base lg:text-lg">View all purchase and sale transactions</p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center justify-center space-x-2 hover:bg-slate-50 border-slate-300 w-full lg:w-auto">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>

        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by product, customer, or transaction ID..."
              className="pl-10 border-slate-300 focus:border-blue-500 bg-white rounded-lg sm:rounded-xl"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl px-3 sm:px-4 h-10">
              <Filter className="w-4 h-4 text-slate-500" />
              <select className="bg-transparent text-sm focus:outline-none">
                <option>All Types</option>
                <option>Sale</option>
                <option>Purchase</option>
              </select>
            </div>
            <Button variant="outline" className="hover:bg-slate-50 border-slate-300 rounded-lg sm:rounded-xl">Filters</Button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {transactions?.map((transaction) => (
            <div key={transaction.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded text-sm">
                    {transaction.id}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{transaction.date}</p>
                </div>
                <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                  {transaction.type}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">Product:</span>
                  <span className="text-xs text-slate-900 text-right flex-1 ml-2">{transaction.product}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">Quantity:</span>
                  <span className="text-xs">{transaction.quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">Amount:</span>
                  <span className="text-xs font-bold">{transaction.amount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">Customer:</span>
                  <span className="text-xs">{transaction.customer}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">Supplier:</span>
                  <span className="text-xs">{transaction.supplier}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
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
