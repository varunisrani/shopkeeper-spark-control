
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInvoices } from '@/hooks/useInvoices';
import { Skeleton } from '@/components/ui/skeleton';

const Invoices = () => {
  const { data: invoices, isLoading } = useInvoices();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
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
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border">
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
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

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Invoice History
            </h1>
            <p className="text-slate-600 mt-1 text-lg">View and manage all generated invoices</p>
          </div>
        </div>

        <div className="space-y-4">
          {invoices?.map((invoice) => (
            <div key={invoice.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-slate-900">{invoice.id}</h3>
                      <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                      <span className="font-medium">{invoice.customer}</span>
                      <span>•</span>
                      <span>{invoice.product}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{invoice.amount}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="hover:bg-slate-50 border-slate-300">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-slate-50 border-slate-300">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
