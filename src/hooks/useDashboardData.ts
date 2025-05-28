
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get total revenue from sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('final_amount');

      if (salesError) throw salesError;

      const totalRevenue = salesData?.reduce((sum, sale) => sum + parseFloat(sale.final_amount), 0) || 0;

      // Get total sales count
      const { count: salesCount, error: salesCountError } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true });

      if (salesCountError) throw salesCountError;

      // Get current stock count
      const { count: stockCount, error: stockError } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'In Stock');

      if (stockError) throw stockError;

      // Calculate profit (simplified calculation)
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('purchase_price, sale_price, status');

      if (inventoryError) throw inventoryError;

      const totalProfit = inventoryData
        ?.filter(item => item.status === 'Sold')
        .reduce((sum, item) => sum + (parseFloat(item.sale_price) - parseFloat(item.purchase_price)), 0) || 0;

      return {
        totalRevenue,
        totalSales: salesCount || 0,
        currentStock: stockCount || 0,
        totalProfit,
      };
    },
  });
};

export const useSalesChart = () => {
  return useQuery({
    queryKey: ['sales-chart'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('final_amount, sale_date')
        .order('sale_date', { ascending: true });

      if (error) throw error;

      // Group sales by date and calculate totals
      const salesByDate = data?.reduce((acc, sale) => {
        const date = new Date(sale.sale_date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!acc[date]) {
          acc[date] = { sales: 0, profit: 0 };
        }
        
        acc[date].sales += parseFloat(sale.final_amount);
        acc[date].profit += parseFloat(sale.final_amount) * 0.3; // Assume 30% profit margin
        
        return acc;
      }, {} as Record<string, { sales: number; profit: number }>);

      return Object.entries(salesByDate || {}).map(([date, data]) => ({
        name: date,
        sales: Math.round(data.sales),
        profit: Math.round(data.profit),
      }));
    },
  });
};

export const useRecentSales = () => {
  return useQuery({
    queryKey: ['recent-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers (
            name
          ),
          inventory (
            brand,
            model
          )
        `)
        .order('sale_date', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map(sale => ({
        id: sale.customer_id?.slice(0, 2).toUpperCase() || 'UN',
        name: sale.customers?.name || 'Unknown Customer',
        product: `${sale.inventory?.brand} ${sale.inventory?.model}`,
        amount: `+₹${parseFloat(sale.final_amount).toLocaleString('en-IN')}`,
      })) || [];
    },
  });
};
