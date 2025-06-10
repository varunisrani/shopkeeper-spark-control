import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Edit2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Sale {
  id: string;
  sale_id: string;
  sale_price: number;
  final_amount: number;
  payment_method: string;
  customer_address: string | null;
  exchange_old_phone: boolean;
  additional_sale_notes: string | null;
  sale_date: string;
  customer_name?: string;
  customer_phone?: string;
  imei_serial?: string;
}

interface EditSaleDialogProps {
  sale: Sale;
}

const EditSaleDialog = ({ sale }: EditSaleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sale_price: sale.sale_price.toString(),
    final_amount: sale.final_amount.toString(),
    payment_method: sale.payment_method,
    customer_address: sale.customer_address || '',
    exchange_old_phone: sale.exchange_old_phone,
    additional_sale_notes: sale.additional_sale_notes || '',
    sale_date: sale.sale_date.split('T')[0],
    customer_name: sale.customer_name || '',
    customer_phone: sale.customer_phone || '',
  });

  const queryClient = useQueryClient();

  const editSaleMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('sales')
        .update({
          sale_price: parseFloat(data.sale_price),
          final_amount: parseFloat(data.final_amount),
          payment_method: data.payment_method,
          customer_address: data.customer_address || null,
          exchange_old_phone: data.exchange_old_phone,
          additional_sale_notes: data.additional_sale_notes || null,
          sale_date: data.sale_date,
          customer_name: data.customer_name || null,
          customer_phone: data.customer_phone || null,
        })
        .eq('id', sale.id);

      if (error) throw error;

      // Also update the inventory record
      const { error: inventoryError } = await supabase
        .from('inventory')
        .update({
          sale_date: data.sale_date,
          customer_name: data.customer_name || null,
          customer_phone: data.customer_phone || null,
          customer_address: data.customer_address || null,
          payment_method: data.payment_method,
          exchange_old_phone: data.exchange_old_phone,
          additional_sale_notes: data.additional_sale_notes || null,
        })
        .eq('imei', sale.imei_serial);

      if (inventoryError) throw inventoryError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Sale updated successfully!');
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error updating sale:', error);
      toast.error('Failed to update sale. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editSaleMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Sale Record</DialogTitle>
          <p className="text-sm text-gray-600">Update the details of this sale.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sale ID and IMEI Display */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-700">Sale ID:</span>
              <span className="text-sm font-mono">{sale.sale_id}</span>
            </div>
            {sale.imei_serial && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-700">IMEI/Serial:</span>
                <span className="text-sm font-mono">{sale.imei_serial}</span>
              </div>
            )}
          </div>

          {/* Sale Price and Final Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sale_price" className="text-sm font-medium text-gray-700">Sale Price (₹)</Label>
              <Input
                id="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={(e) => handleInputChange('sale_price', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="final_amount" className="text-sm font-medium text-gray-700">Final Amount (₹)</Label>
              <Input
                id="final_amount"
                type="number"
                value={formData.final_amount}
                onChange={(e) => handleInputChange('final_amount', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Customer Name and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customer_name" className="text-sm font-medium text-gray-700">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customer_phone" className="text-sm font-medium text-gray-700">Customer Phone</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Customer Address */}
          <div>
            <Label htmlFor="customer_address" className="text-sm font-medium text-gray-700">Customer Address</Label>
            <Input
              id="customer_address"
              value={formData.customer_address}
              onChange={(e) => handleInputChange('customer_address', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Payment Method and Sale Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="payment_method" className="text-sm font-medium text-gray-700">Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Credit Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sale_date" className="text-sm font-medium text-gray-700">Sale Date</Label>
              <Input
                id="sale_date"
                type="date"
                value={formData.sale_date}
                onChange={(e) => handleInputChange('sale_date', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Exchange Phone Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="exchange_old_phone"
              checked={formData.exchange_old_phone}
              onCheckedChange={(checked) => handleInputChange('exchange_old_phone', checked)}
            />
            <Label htmlFor="exchange_old_phone" className="text-sm font-medium text-gray-700">Exchange Old Phone</Label>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additional_sale_notes" className="text-sm font-medium text-gray-700">Additional Notes</Label>
            <Textarea
              id="additional_sale_notes"
              value={formData.additional_sale_notes}
              onChange={(e) => handleInputChange('additional_sale_notes', e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="w-full sm:w-auto px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-black hover:bg-gray-800 w-full sm:w-auto px-6"
              disabled={editSaleMutation.isPending}
            >
              {editSaleMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSaleDialog; 