
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  brand: string;
  model: string;
  variant: string;
  color?: string;
  imei: string;
  purchase_price: number;
  sale_price: number;
  condition: string;
  battery_health: number;
  warranty_months?: number;
  quantity?: number;
  venue?: string;
  inward_by?: string;
  additional_notes?: string;
  status: string;
  purchase_date: string;
  sale_date?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  payment_method?: string;
  exchange_old_phone?: boolean;
  additional_sale_notes?: string;
  sold_date?: string;
  suppliers?: {
    name: string;
  };
}

export interface NewInventoryItem {
  brand: string;
  model: string;
  variant: string;
  color?: string;
  imei: string;
  purchase_price: string | number;
  sale_price: string | number;
  condition: string;
  battery_health: string | number;
  warranty_months?: string | number;
  quantity?: string | number;
  venue?: string;
  inward_by?: string;
  additional_notes?: string;
  supplier_id: string;
  purchase_date: string;
  sale_date?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  payment_method?: string;
  exchange_old_phone?: boolean;
  additional_sale_notes?: string;
}

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      console.log('Fetching inventory data from Supabase...');
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          suppliers (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inventory:', error);
        throw error;
      }

      console.log('Inventory data fetched successfully:', data);
      return data as InventoryItem[];
    },
  });
};

export const useAddInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: NewInventoryItem) => {
      console.log('Adding new inventory item to Supabase:', newItem);
      
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          brand: newItem.brand,
          model: newItem.model,
          variant: newItem.variant,
          color: newItem.color,
          imei: newItem.imei,
          purchase_price: typeof newItem.purchase_price === 'string' ? parseFloat(newItem.purchase_price) || 0 : newItem.purchase_price,
          sale_price: typeof newItem.sale_price === 'string' ? parseFloat(newItem.sale_price) || 0 : newItem.sale_price,
          condition: newItem.condition,
          battery_health: typeof newItem.battery_health === 'string' ? parseInt(newItem.battery_health) || 100 : newItem.battery_health,
          warranty_months: typeof newItem.warranty_months === 'string' ? parseInt(newItem.warranty_months) || 0 : newItem.warranty_months,
          quantity: typeof newItem.quantity === 'string' ? parseInt(newItem.quantity) || 1 : newItem.quantity,
          venue: newItem.venue,
          inward_by: newItem.inward_by,
          additional_notes: newItem.additional_notes,
          supplier_id: newItem.supplier_id || null,
          purchase_date: newItem.purchase_date,
          sale_date: newItem.sale_date || null,
          customer_name: newItem.customer_name,
          customer_phone: newItem.customer_phone,
          customer_address: newItem.customer_address,
          payment_method: newItem.payment_method,
          exchange_old_phone: newItem.exchange_old_phone || false,
          additional_sale_notes: newItem.additional_sale_notes,
          status: 'In Stock'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding inventory item:', error);
        throw error;
      }

      console.log('Inventory item added successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item added successfully!');
      console.log('Inventory cache invalidated and success toast shown');
    },
    onError: (error) => {
      console.error('Failed to add inventory item:', error);
      toast.error('Failed to add inventory item. Please try again.');
    },
  });
};
