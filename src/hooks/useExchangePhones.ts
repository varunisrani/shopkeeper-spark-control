import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type ExchangePhone = Tables<'exchange_phones'>;
type ExchangePhoneInsert = TablesInsert<'exchange_phones'>;
type ExchangePhoneUpdate = TablesUpdate<'exchange_phones'>;

export const useExchangePhones = () => {
  const [exchangePhones, setExchangePhones] = useState<ExchangePhone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExchangePhones = async () => {
    try {
      const { data, error } = await supabase
        .from('exchange_phones')
        .select(`
          *,
          sales:sales_id (
            id,
            sale_id,
            customer_id,
            customers:customer_id (name, phone)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExchangePhones(data || []);
    } catch (error) {
      console.error('Error fetching exchange phones:', error);
      toast.error('Failed to fetch exchange phones');
    } finally {
      setLoading(false);
    }
  };

  const addExchangePhone = async (exchangePhone: ExchangePhoneInsert) => {
    try {
      const { data, error } = await supabase
        .from('exchange_phones')
        .insert(exchangePhone)
        .select()
        .single();

      if (error) throw error;

      setExchangePhones(prev => [data, ...prev]);
      toast.success('Exchange phone recorded successfully');
      return data;
    } catch (error) {
      console.error('Error adding exchange phone:', error);
      toast.error('Failed to record exchange phone');
      throw error;
    }
  };

  const updateExchangePhone = async (id: string, updates: ExchangePhoneUpdate) => {
    try {
      const { data, error } = await supabase
        .from('exchange_phones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setExchangePhones(prev => 
        prev.map(phone => phone.id === id ? data : phone)
      );
      toast.success('Exchange phone updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating exchange phone:', error);
      toast.error('Failed to update exchange phone');
      throw error;
    }
  };

  const addToInventory = async (exchangePhoneId: string) => {
    try {
      // Get the exchange phone details
      const { data: exchangePhone, error: fetchError } = await supabase
        .from('exchange_phones')
        .select('*')
        .eq('id', exchangePhoneId)
        .single();

      if (fetchError) throw fetchError;

      if (exchangePhone.added_to_inventory) {
        toast.error('Exchange phone is already added to inventory');
        return;
      }

      // Create new inventory item
      const inventoryData = {
        brand: exchangePhone.brand,
        model: exchangePhone.model,
        imei: exchangePhone.imei || `EX-${Date.now()}`,
        condition: exchangePhone.condition,
        color: exchangePhone.color,
        variant: exchangePhone.storage,
        purchase_price: exchangePhone.exchange_value,
        sale_price: exchangePhone.exchange_value * 1.2, // 20% markup
        purchase_date: new Date().toISOString().split('T')[0],
        status: 'available',
        additional_notes: `Exchange phone from sale. Original specs: ${exchangePhone.specifications || 'N/A'}. Notes: ${exchangePhone.notes || 'N/A'}`,
      };

      const { data: newInventory, error: inventoryError } = await supabase
        .from('inventory')
        .insert(inventoryData)
        .select()
        .single();

      if (inventoryError) throw inventoryError;

      // Update exchange phone to mark as added to inventory
      const { error: updateError } = await supabase
        .from('exchange_phones')
        .update({ 
          added_to_inventory: true, 
          inventory_id: newInventory.id 
        })
        .eq('id', exchangePhoneId);

      if (updateError) throw updateError;

      await fetchExchangePhones(); // Refresh data
      toast.success('Exchange phone added to inventory successfully');
    } catch (error) {
      console.error('Error adding to inventory:', error);
      toast.error('Failed to add exchange phone to inventory');
    }
  };

  const getExchangePhonesBySaleId = (saleId: string) => {
    return exchangePhones.filter(phone => phone.sales_id === saleId);
  };

  useEffect(() => {
    fetchExchangePhones();
  }, []);

  return {
    exchangePhones,
    loading,
    addExchangePhone,
    updateExchangePhone,
    addToInventory,
    getExchangePhonesBySaleId,
    refreshExchangePhones: fetchExchangePhones,
  };
};