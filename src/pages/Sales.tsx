import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import RecordSaleDialog from '@/components/RecordSaleDialog';
import EditSaleDialog from '@/components/EditSaleDialog';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { toast } from 'sonner';

const Sales = () => {
  const queryClient = useQueryClient();

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          inventory:inventory_id (
            brand,
            model,
            variant,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['sales'] });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Sales Management
              </h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base lg:text-lg">Track and manage all your sales transactions</p>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <RecordSaleDialog />
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by sale ID, customer name, or IMEI..."
              className="pl-10 border-slate-300 focus:border-emerald-500 bg-white rounded-lg sm:rounded-xl"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl px-3 sm:px-4 h-10">
            <Filter className="w-4 h-4 text-slate-500" />
            <select className="bg-transparent text-sm focus:outline-none">
              <option>All Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sale Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {sales?.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900">{sale.sale_id}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-slate-900">
                          {sale.customer_name || 'N/A'}
                        </div>
                        {sale.customer_phone && (
                          <div className="text-xs text-slate-500">{sale.customer_phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {sale.inventory ? (
                          <>
                            <div className="text-sm font-medium text-slate-900">
                              {sale.inventory.brand} {sale.inventory.model}
                            </div>
                            <div className="text-xs text-slate-500">
                              {sale.inventory.variant}, {sale.inventory.color}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-slate-500">Device details not available</div>
                        )}
                        {sale.imei_serial && (
                          <div className="text-xs font-mono text-slate-500">
                            IMEI: {sale.imei_serial}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900">
                          {formatCurrency(sale.final_amount)}
                        </div>
                        {sale.discount > 0 && (
                          <div className="text-xs text-slate-500">
                            Discount: {formatCurrency(sale.discount)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                        {sale.payment_method}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <EditSaleDialog sale={sale} />
                      <DeleteConfirmationDialog
                        title="Delete Sale Record"
                        description={`Are you sure you want to delete sale record ${sale.sale_id}? This action cannot be undone.`}
                        onDelete={() => handleDelete(sale.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {sales?.map((sale) => (
            <div key={sale.id} className="bg-white rounded-xl border border-slate-200 shadow-md p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold text-slate-900">{sale.sale_id}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                  {sale.payment_method}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500">Customer</div>
                  <div className="text-sm font-medium text-slate-900">
                    {sale.customer_name || 'N/A'}
                  </div>
                  {sale.customer_phone && (
                    <div className="text-xs text-slate-500">{sale.customer_phone}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-slate-500">Device</div>
                  {sale.inventory ? (
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {sale.inventory.brand} {sale.inventory.model}
                      </div>
                      <div className="text-xs text-slate-500">
                        {sale.inventory.variant}, {sale.inventory.color}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">Device details not available</div>
                  )}
                  {sale.imei_serial && (
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      IMEI: {sale.imei_serial}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-slate-500">Amount</div>
                  <div className="text-sm font-bold text-slate-900">
                    {formatCurrency(sale.final_amount)}
                  </div>
                  {sale.discount > 0 && (
                    <div className="text-xs text-slate-500">
                      Discount: {formatCurrency(sale.discount)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <EditSaleDialog sale={sale} />
                <DeleteConfirmationDialog
                  title="Delete Sale Record"
                  description={`Are you sure you want to delete sale record ${sale.sale_id}? This action cannot be undone.`}
                  onDelete={() => handleDelete(sale.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-md p-4">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales; 