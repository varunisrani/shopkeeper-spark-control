
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customers (
            name
          ),
          suppliers (
            name
          ),
          inventory (
            brand,
            model
          )
        `)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      return data?.map(transaction => ({
        id: transaction.transaction_id,
        date: new Date(transaction.transaction_date).toISOString().split('T')[0],
        type: transaction.type,
        product: `${transaction.inventory?.brand || ''} ${transaction.inventory?.model || ''}`,
        quantity: transaction.quantity,
        amount: `₹${parseFloat(transaction.amount.toString()).toLocaleString('en-IN')}`,
        customer: transaction.customers?.name || '-',
        supplier: transaction.suppliers?.name || '-',
      })) || [];
    },
  });
};
