
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Invoices = () => {
  const invoices = [
    {
      id: 'SALE-170312345678',
      customer: 'John Doe',
      product: 'iPhone 13 Pro',
      amount: '₹1,29,900',
      date: '21 Dec 2023',
      status: 'Paid'
    },
    {
      id: 'SALE-170302345678',
      customer: 'Alice Smith',
      product: 'Samsung Galaxy S22',
      amount: '₹99,900',
      date: '20 Dec 2023',
      status: 'Paid'
    },
    {
      id: 'SALE-170292345678',
      customer: 'Robert Johnson',
      product: 'Google Pixel 6',
      amount: '₹89,900',
      date: '19 Dec 2023',
      status: 'Pending'
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

      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice History</h1>
          <p className="text-gray-600">View and manage all generated invoices</p>
        </div>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
                    <Badge 
                      variant={invoice.status === 'Paid' ? 'default' : 'secondary'}
                      className={invoice.status === 'Paid' ? 'bg-gray-900 text-white' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span>{invoice.customer}</span>
                    <span>•</span>
                    <span>{invoice.product}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-gray-900">{invoice.amount}</div>
                <Button variant="outline">View Invoice</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoices;
