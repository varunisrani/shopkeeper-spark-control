
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  brand: string;
  model: string;
  variant: string;
  imei: string;
  purchase_price: number;
  sale_price: number;
  condition: string;
  battery_health: number;
  status: string;
  purchase_date: string;
  suppliers?: {
    name: string;
  };
}

export interface NewInventoryItem {
  brand: string;
  model: string;
  variant: string;
  imei: string;
  purchase_price: number;
  sale_price: number;
  condition: string;
  battery_health: number;
  supplier_id: string;
  purchase_date: string;
}

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
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

      return data as InventoryItem[];
    },
  });
};

export const useAddInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: NewInventoryItem) => {
      const { data, error } = await supabase
        .from('inventory')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.error('Error adding inventory:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item added successfully!');
    },
    onError: (error) => {
      console.error('Error adding inventory:', error);
      toast.error('Failed to add inventory item');
    },
  });
};
