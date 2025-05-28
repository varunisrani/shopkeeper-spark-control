
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            name
          ),
          sales (
            inventory (
              brand,
              model
            )
          )
        `)
        .order('invoice_date', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }

      return data?.map(invoice => ({
        id: invoice.invoice_id,
        customer: invoice.customers?.name || 'Unknown Customer',
        product: `${invoice.sales?.inventory?.brand || ''} ${invoice.sales?.inventory?.model || ''}`,
        amount: `₹${parseFloat(invoice.total_amount).toLocaleString('en-IN')}`,
        date: new Date(invoice.invoice_date).toLocaleDateString('en-IN'),
        status: invoice.status,
      })) || [];
    },
  });
};
