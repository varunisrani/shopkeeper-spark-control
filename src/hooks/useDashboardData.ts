
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  calculateTotalRevenue, 
  calculateTotalProfit, 
  calculateProfit,
  parseAmount,
  formatCurrency 
} from '@/lib/calculations';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        // Get total revenue from sales with consistent data parsing
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('final_amount');

        if (salesError) throw salesError;

        // Use standardized calculation utility for revenue
        const revenueAmounts = salesData?.map(sale => parseAmount(sale.final_amount)) || [];
        const totalRevenue = calculateTotalRevenue(revenueAmounts);

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

        // Get inventory data with consistent data joins for profit calculation
        const { data: inventoryData, error: inventoryError } = await supabase
          .from('inventory')
          .select('purchase_price, sale_price, status')
          .eq('status', 'Sold'); // Only fetch sold items for profit calculation

        if (inventoryError) throw inventoryError;

        // Use standardized calculation utility for profit with proper data parsing
        const profitData = inventoryData?.map(item => ({
          salePrice: parseAmount(item.sale_price),
          purchasePrice: parseAmount(item.purchase_price)
        })) || [];

        const totalProfit = calculateTotalProfit(profitData);

        // Return formatted results with consistent precision
        return {
          totalRevenue: formatCurrency(totalRevenue),
          totalSales: salesCount || 0,
          currentStock: stockCount || 0,
          totalProfit: formatCurrency(totalProfit),
        };
      } catch (error) {
        // Enhanced error handling with fallback values
        console.error('Dashboard stats calculation error:', error);
        
        // Return safe fallback values
        return {
          totalRevenue: 0,
          totalSales: 0,
          currentStock: 0,
          totalProfit: 0,
        };
      }
    },
    // Add error handling configuration
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors, but not for data errors
      if (failureCount < 2 && error?.message?.includes('network')) {
        return true;
      }
      return false;
    },
    // Set stale time to reduce unnecessary refetches
    staleTime: 30000, // 30 seconds
  });
};

export const useSalesChart = () => {
  return useQuery({
    queryKey: ['sales-chart'],
    queryFn: async () => {
      try {
        // Get sales data with inventory information for actual profit calculation
        const { data, error } = await supabase
          .from('sales')
          .select(`
            final_amount, 
            sale_date,
            inventory!inner(
              purchase_price,
              sale_price
            )
          `)
          .order('sale_date', { ascending: true });

        if (error) throw error;

        // Group sales by date and calculate actual profits
        const salesByDate = data?.reduce((acc, sale) => {
          const date = new Date(sale.sale_date).toLocaleDateString('en-IN', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          if (!acc[date]) {
            acc[date] = { sales: 0, profit: 0 };
          }
          
          // Use standardized calculation utilities for actual profit
          const salePrice = parseAmount(sale.inventory?.sale_price || sale.final_amount);
          const purchasePrice = parseAmount(sale.inventory?.purchase_price || 0);
          const actualProfit = calculateProfit(salePrice, purchasePrice);
          
          acc[date].sales += salePrice;
          acc[date].profit += actualProfit.isValid ? actualProfit.profit : 0;
          
          return acc;
        }, {} as Record<string, { sales: number; profit: number }>);

        return Object.entries(salesByDate || {}).map(([date, data]) => ({
          name: date,
          sales: Math.round(formatCurrency(data.sales)),
          profit: Math.round(formatCurrency(data.profit)),
        }));
      } catch (error) {
        console.error('Sales chart calculation error:', error);
        
        // Fallback to basic sales data without profit if inventory join fails
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('sales')
          .select('final_amount, sale_date')
          .order('sale_date', { ascending: true });

        if (fallbackError) throw fallbackError;

        const salesByDate = fallbackData?.reduce((acc, sale) => {
          const date = new Date(sale.sale_date).toLocaleDateString('en-IN', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          if (!acc[date]) {
            acc[date] = { sales: 0, profit: 0 };
          }
          
          const saleAmount = parseAmount(sale.final_amount);
          acc[date].sales += saleAmount;
          acc[date].profit = 0; // Can't calculate without inventory data
          
          return acc;
        }, {} as Record<string, { sales: number; profit: number }>);

        return Object.entries(salesByDate || {}).map(([date, data]) => ({
          name: date,
          sales: Math.round(data.sales),
          profit: 0, // Indicate no profit data available
        }));
      }
    },
    // Enhanced error handling and caching
    retry: (failureCount, error) => {
      if (failureCount < 2 && error?.message?.includes('network')) {
        return true;
      }
      return false;
    },
    staleTime: 60000, // 1 minute - charts can be slightly less fresh than dashboard stats
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
        amount: `+₹${parseFloat(sale.final_amount.toString()).toLocaleString('en-IN')}`,
      })) || [];
    },
  });
};
