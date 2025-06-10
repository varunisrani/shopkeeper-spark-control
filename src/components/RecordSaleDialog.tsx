
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useInventory } from '@/hooks/useInventory';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

const RecordSaleDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    color: '',
    imei: '',
    purchase_price: '',
    sale_price: '',
    condition: 'New',
    battery_health: '',
    warranty_months: '',
    quantity: '',
    purchase_date: new Date().toISOString().split('T')[0],
    sale_date: new Date().toISOString().split('T')[0],
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    payment_method: 'Cash',
    exchange_old_phone: false,
    additional_notes: '',
    additional_sale_notes: '',
    venue: '',
    inward_by: '',
    supplier_id: '',
    inventory_id: '',
    discount: '',
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
            address: saleData.customer_address,
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

      const finalAmount = parseFloat(saleData.sale_price || inventoryItem.sale_price.toString()) - parseFloat(saleData.discount || '0');
      const saleId = `SALE-${Date.now()}`;

      // Create sale record
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          sale_id: saleId,
          customer_id: customerId,
          inventory_id: saleData.inventory_id,
          sale_price: parseFloat(saleData.sale_price || inventoryItem.sale_price.toString()),
          discount: parseFloat(saleData.discount || '0'),
          final_amount: finalAmount,
          payment_method: saleData.payment_method,
          customer_address: saleData.customer_address,
          exchange_old_phone: saleData.exchange_old_phone,
          additional_sale_notes: saleData.additional_sale_notes,
          imei_serial: saleData.imei,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Update inventory status and add sale details
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ 
          status: 'Sold',
          sold_date: saleData.sale_date,
          sale_date: saleData.sale_date,
          customer_name: saleData.customer_name,
          customer_phone: saleData.customer_phone,
          customer_address: saleData.customer_address,
          payment_method: saleData.payment_method,
          exchange_old_phone: saleData.exchange_old_phone,
          additional_sale_notes: saleData.additional_sale_notes,
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
          subtotal: parseFloat(saleData.sale_price || inventoryItem.sale_price.toString()),
          discount: parseFloat(saleData.discount || '0'),
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
        brand: '',
        model: '',
        variant: '',
        color: '',
        imei: '',
        purchase_price: '',
        sale_price: '',
        condition: 'New',
        battery_health: '',
        warranty_months: '',
        quantity: '',
        purchase_date: new Date().toISOString().split('T')[0],
        sale_date: new Date().toISOString().split('T')[0],
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        payment_method: 'Cash',
        exchange_old_phone: false,
        additional_notes: '',
        additional_sale_notes: '',
        venue: '',
        inward_by: '',
        supplier_id: '',
        inventory_id: '',
        discount: '',
      });
    },
    onError: (error) => {
      console.error('Error recording sale:', error);
      toast.error('Failed to record sale');
    },
  });

  const selectedItem = availableInventory.find(item => item.id === formData.inventory_id);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill fields when inventory item is selected
    if (field === 'inventory_id' && value) {
      const item = availableInventory.find(inv => inv.id === value);
      if (item) {
        setFormData(prev => ({
          ...prev,
          brand: item.brand,
          model: item.model,
          variant: item.variant || '',
          color: item.color || '',
          imei: item.imei,
          purchase_price: item.purchase_price.toString(),
          sale_price: item.sale_price.toString(),
          condition: item.condition,
          battery_health: item.battery_health?.toString() || '',
          warranty_months: item.warranty_months?.toString() || '',
          quantity: item.quantity?.toString() || '1',
          purchase_date: item.purchase_date,
          venue: item.venue || '',
          inward_by: item.inward_by || '',
          supplier_id: '',
          additional_notes: item.additional_notes || '',
        }));
      }
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Record Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Record New Sale</DialogTitle>
          <DialogDescription>
            Record a new sale and generate invoice automatically
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Select Device First */}
          <div>
            <Label htmlFor="inventory" className="text-sm font-medium">Select Device</Label>
            <Select value={formData.inventory_id} onValueChange={(value) => handleInputChange('inventory_id', value)}>
              <SelectTrigger className="mt-1">
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

          {/* Row 1: Brand and Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="brand" className="text-sm font-medium text-gray-700">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Brand"
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="model" className="text-sm font-medium text-gray-700">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Model"
                className="mt-1"
                readOnly
              />
            </div>
          </div>

          {/* Row 2: Variant and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="variant" className="text-sm font-medium text-gray-700">Variant</Label>
              <Input
                id="variant"
                value={formData.variant}
                onChange={(e) => handleInputChange('variant', e.target.value)}
                placeholder="Variant"
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="color" className="text-sm font-medium text-gray-700">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Color"
                className="mt-1"
                readOnly
              />
            </div>
          </div>

          {/* Row 3: IMEI and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="imei" className="text-sm font-medium text-gray-700">IMEI/Serial Number</Label>
              <Input
                id="imei"
                value={formData.imei}
                onChange={(e) => handleInputChange('imei', e.target.value)}
                placeholder="IMEI"
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="condition" className="text-sm font-medium text-gray-700">Condition</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                placeholder="Condition"
                className="mt-1"
                readOnly
              />
            </div>
          </div>

          {/* Row 4: Purchase Price and Sale Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="purchase_price" className="text-sm font-medium text-gray-700">Purchase Price (₹)</Label>
              <Input
                id="purchase_price"
                type="number"
                value={formData.purchase_price}
                onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                placeholder=""
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="sale_price" className="text-sm font-medium text-gray-700">Sale Price (₹)</Label>
              <Input
                id="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={(e) => handleInputChange('sale_price', e.target.value)}
                placeholder=""
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 5: Battery Health and Warranty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="battery_health" className="text-sm font-medium text-gray-700">Battery Health (%)</Label>
              <Input
                id="battery_health"
                type="number"
                value={formData.battery_health}
                onChange={(e) => handleInputChange('battery_health', e.target.value)}
                placeholder=""
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="warranty_months" className="text-sm font-medium text-gray-700">Warranty (months)</Label>
              <Input
                id="warranty_months"
                type="number"
                value={formData.warranty_months}
                onChange={(e) => handleInputChange('warranty_months', e.target.value)}
                placeholder=""
                className="mt-1"
                readOnly
              />
            </div>
          </div>

          {/* Row 6: Quantity and Sale Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder=""
                className="mt-1"
                readOnly
              />
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

          {/* Row 7: Customer Name and Customer Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customer_name" className="text-sm font-medium text-gray-700">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                placeholder="Enter customer name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customer_phone" className="text-sm font-medium text-gray-700">Customer Phone</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 8: Payment Method and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="payment_method" className="text-sm font-medium text-gray-700">Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
                <SelectTrigger className="mt-1">
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
            <div>
              <Label htmlFor="discount" className="text-sm font-medium text-gray-700">Discount Amount</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
                placeholder=""
                min="0"
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 9: Customer Address */}
          <div>
            <Label htmlFor="customer_address" className="text-sm font-medium text-gray-700">Customer Address</Label>
            <Textarea
              id="customer_address"
              value={formData.customer_address}
              onChange={(e) => handleInputChange('customer_address', e.target.value)}
              placeholder="Enter customer address"
              rows={2}
              className="mt-1"
            />
          </div>

          {/* Row 10: Venue and Inward By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="venue" className="text-sm font-medium text-gray-700">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                placeholder="Store location"
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="inward_by" className="text-sm font-medium text-gray-700">Inward By</Label>
              <Input
                id="inward_by"
                value={formData.inward_by}
                onChange={(e) => handleInputChange('inward_by', e.target.value)}
                placeholder="Name of receiver"
                className="mt-1"
                readOnly
              />
            </div>
          </div>

          {/* Row 11: Exchange Old Phone */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="exchange_old_phone"
              checked={formData.exchange_old_phone}
              onCheckedChange={(checked) => handleCheckboxChange('exchange_old_phone', checked as boolean)}
            />
            <Label htmlFor="exchange_old_phone" className="text-sm font-medium text-gray-700">
              Exchange Old Phone
            </Label>
          </div>

          {/* Row 12: Additional Notes */}
          <div>
            <Label htmlFor="additional_notes" className="text-sm font-medium text-gray-700">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              value={formData.additional_notes}
              onChange={(e) => handleInputChange('additional_notes', e.target.value)}
              placeholder="Any additional information"
              rows={3}
              className="mt-1"
              readOnly
            />
          </div>

          {/* Row 13: Additional Sale Notes */}
          <div>
            <Label htmlFor="additional_sale_notes" className="text-sm font-medium text-gray-700">Additional Sale Notes</Label>
            <Textarea
              id="additional_sale_notes"
              value={formData.additional_sale_notes}
              onChange={(e) => handleInputChange('additional_sale_notes', e.target.value)}
              placeholder="Any additional sale-related information"
              rows={3}
              className="mt-1"
            />
          </div>

          {selectedItem && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Final Amount:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ₹{(parseFloat(formData.sale_price || selectedItem.sale_price.toString()) - parseFloat(formData.discount || '0')).toLocaleString('en-IN')}
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
