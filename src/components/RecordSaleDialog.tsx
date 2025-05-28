
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory } from '@/hooks/useInventory';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

const RecordSaleDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    inventory_id: '',
    discount: 0,
    payment_method: 'Cash',
  });

  const { data: inventory } = useInventory();
  const queryClient = useQueryClient();

  const availableInventory = inventory?.filter(item => item.status === 'In Stock') || [];

  const recordSaleMutation = useMutation({
    mutationFn: async (saleData: typeof formData) => {
      // First, create or find customer
      let customerId;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', saleData.customer_phone)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: saleData.customer_name,
            phone: saleData.customer_phone,
            email: saleData.customer_email,
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Get inventory item details
      const { data: inventoryItem, error: inventoryError } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', saleData.inventory_id)
        .single();

      if (inventoryError) throw inventoryError;

      const finalAmount = parseFloat(inventoryItem.sale_price.toString()) - saleData.discount;
      const saleId = `SALE-${Date.now()}`;

      // Create sale record
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          sale_id: saleId,
          customer_id: customerId,
          inventory_id: saleData.inventory_id,
          sale_price: parseFloat(inventoryItem.sale_price.toString()),
          discount: saleData.discount,
          final_amount: finalAmount,
          payment_method: saleData.payment_method,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Update inventory status
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ 
          status: 'Sold',
          sold_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', saleData.inventory_id);

      if (updateError) throw updateError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          transaction_id: `TXN-${Date.now()}`,
          type: 'Sale',
          inventory_id: saleData.inventory_id,
          customer_id: customerId,
          amount: finalAmount,
          quantity: 1,
        });

      if (transactionError) throw transactionError;

      // Create invoice
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_id: `INV-${Date.now()}`,
          sale_id: sale.id,
          customer_id: customerId,
          subtotal: parseFloat(inventoryItem.sale_price.toString()),
          discount: saleData.discount,
          total_amount: finalAmount,
        });

      if (invoiceError) throw invoiceError;

      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['sales-chart'] });
      queryClient.invalidateQueries({ queryKey: ['recent-sales'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Sale recorded successfully!');
      setOpen(false);
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        inventory_id: '',
        discount: 0,
        payment_method: 'Cash',
      });
    },
    onError: (error) => {
      console.error('Error recording sale:', error);
      toast.error('Failed to record sale');
    },
  });

  const selectedItem = availableInventory.find(item => item.id === formData.inventory_id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Record Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Record New Sale</DialogTitle>
          <DialogDescription>
            Record a new sale and generate invoice automatically
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="text-sm font-medium">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Enter customer name"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="Enter phone number"
                className="border-gray-300"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer_email" className="text-sm font-medium">Email (Optional)</Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              placeholder="Enter email address"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory" className="text-sm font-medium">Select Device</Label>
            <Select value={formData.inventory_id} onValueChange={(value) => setFormData({ ...formData, inventory_id: value })}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select a device to sell" />
              </SelectTrigger>
              <SelectContent>
                {availableInventory.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.brand} {item.model} {item.variant} - ₹{parseFloat(item.sale_price.toString()).toLocaleString('en-IN')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItem && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Device Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">IMEI:</span> {selectedItem.imei}</div>
                <div><span className="font-medium">Condition:</span> {selectedItem.condition}</div>
                <div><span className="font-medium">Battery:</span> {selectedItem.battery_health}%</div>
                <div><span className="font-medium">Price:</span> ₹{parseFloat(selectedItem.sale_price.toString()).toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-sm font-medium">Discount Amount</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method" className="text-sm font-medium">Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedItem && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Final Amount:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ₹{(parseFloat(selectedItem.sale_price.toString()) - formData.discount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => recordSaleMutation.mutate(formData)}
            disabled={!formData.customer_name || !formData.customer_phone || !formData.inventory_id || recordSaleMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {recordSaleMutation.isPending ? 'Recording...' : 'Record Sale'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordSaleDialog;
