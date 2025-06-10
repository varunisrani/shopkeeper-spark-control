import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInvoices } from '@/hooks/useInvoices';
import { useInvoiceOperations } from '@/hooks/useInvoiceOperations';
import { Skeleton } from '@/components/ui/skeleton';

const Invoices = () => {
  const { data: invoices, isLoading } = useInvoices();
  const { viewInvoice, downloadInvoice } = useInvoiceOperations();

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-4 lg:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
            <div>
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
              <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mt-2" />
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-lg border">
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
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Invoice History
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base lg:text-lg">View and manage all generated invoices</p>
          </div>
        </div>

        <div className="space-y-4">
          {invoices?.map((invoice) => (
            <div key={invoice.id} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg sm:rounded-xl flex-shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">{invoice.id}</h3>
                      <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-slate-600 mt-1">
                      <span className="font-medium truncate">{invoice.customer}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{invoice.product}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">{invoice.date}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">{invoice.amount}</div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 sm:flex-none hover:bg-slate-50 border-slate-300 text-xs sm:text-sm"
                      onClick={() => viewInvoice(invoice.id)}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 sm:flex-none hover:bg-slate-50 border-slate-300 text-xs sm:text-sm"
                      onClick={() => downloadInvoice(invoice.id)}
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Download</span>
                      <span className="sm:hidden">DL</span>
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
