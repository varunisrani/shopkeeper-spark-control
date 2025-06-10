import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useInventory } from '@/hooks/useInventory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ShoppingCart, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RecordSaleDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [hasExchange, setHasExchange] = useState(false);
  const [exchangeModel, setExchangeModel] = useState('');
  const [exchangeValue, setExchangeValue] = useState('0');
  const [totalAmount, setTotalAmount] = useState('0');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [exchangeCondition, setExchangeCondition] = useState('');
  const [exchangeBatteryHealth, setExchangeBatteryHealth] = useState('');
  const [exchangeImei, setExchangeImei] = useState('');
  const [notes, setNotes] = useState('');

  const { data: inventory } = useInventory();
  const queryClient = useQueryClient();

  const availableInventory = inventory?.filter(item => item.status === 'In Stock') || [];

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSaleDate(today);
  }, []);

  // Calculate total amount
  useEffect(() => {
    if (salePrice) {
      const sale = parseFloat(salePrice) || 0;
      const exchange = hasExchange ? (parseFloat(exchangeValue) || 0) : 0;
      setTotalAmount((sale - exchange).toFixed(0));
    } else {
      setTotalAmount('0');
    }
  }, [salePrice, hasExchange, exchangeValue]);

  // Find the selected inventory item
  const selectedItem = availableInventory.find(item => item.id === selectedInventory);

  // Handle inventory selection
  const handleInventoryChange = (value: string) => {
    setSelectedInventory(value);
    const item = availableInventory.find(item => item.id === value);
    if (item) {
      setSalePrice(item.sale_price.toString());
    } else {
      setSalePrice('');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const recordSaleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedInventory) {
        throw new Error('Please select a device from inventory');
      }

      // First, create or find customer
      let customerId;
      if (customerPhone) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', customerPhone)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({
              name: customerName || 'Unknown Customer',
              phone: customerPhone,
              address: customerAddress,
            })
            .select('id')
            .single();

          if (customerError) throw customerError;
          customerId = newCustomer.id;
        }
      }

      // Get inventory item details
      const { data: inventoryItem, error: inventoryError } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', selectedInventory)
        .single();

      if (inventoryError) throw inventoryError;

      const finalAmount = parseFloat(salePrice || '0') - (hasExchange ? parseFloat(exchangeValue || '0') : 0);
      const saleId = `SALE-${Date.now()}`;

      // Create sale record
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          sale_id: saleId,
          customer_id: customerId,
          inventory_id: selectedInventory,
          sale_price: parseFloat(salePrice || '0'),
          discount: hasExchange ? parseFloat(exchangeValue || '0') : 0,
          final_amount: finalAmount,
          payment_method: paymentMethod,
          customer_address: customerAddress,
          exchange_old_phone: hasExchange,
          additional_sale_notes: notes,
          imei_serial: inventoryItem.imei,
          sale_date: saleDate + 'T00:00:00.000Z',
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Update inventory status and add sale details
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ 
          status: 'Sold',
          sold_date: saleDate,
          sale_date: saleDate,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          payment_method: paymentMethod,
          exchange_old_phone: hasExchange,
          additional_sale_notes: notes,
        })
        .eq('id', selectedInventory);

      if (updateError) throw updateError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          transaction_id: `TXN-${Date.now()}`,
          type: 'Sale',
          inventory_id: selectedInventory,
          customer_id: customerId,
          amount: finalAmount,
          quantity: 1,
        });

      if (transactionError) throw transactionError;

      // Create invoice
      if (customerId) {
        const { error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            invoice_id: `INV-${Date.now()}`,
            sale_id: sale.id,
            customer_id: customerId,
            subtotal: parseFloat(salePrice || '0'),
            discount: hasExchange ? parseFloat(exchangeValue || '0') : 0,
            total_amount: finalAmount,
          });

        if (invoiceError) throw invoiceError;
      }

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
      resetForm();
    },
    onError: (error) => {
      console.error('Error recording sale:', error);
      toast.error('Failed to record sale');
    },
  });

  const resetForm = () => {
    setSelectedInventory('');
    setSalePrice('');
    setSaleDate(new Date().toISOString().split('T')[0]);
    setHasExchange(false);
    setExchangeModel('');
    setExchangeValue('0');
    setTotalAmount('0');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setPaymentMethod('Cash');
    setExchangeCondition('');
    setExchangeBatteryHealth('');
    setExchangeImei('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    recordSaleMutation.mutate();
    setIsLoading(false);
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
            Select a specific device from inventory to record the sale and generate invoice automatically.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Device Selection */}
          <div className="space-y-2">
            <Label htmlFor="inventory">Select Device from Inventory</Label>
            <Select value={selectedInventory} onValueChange={handleInventoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                {availableInventory.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.brand} {item.model} {item.variant} - {item.color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Device Details and IMEI */}
            {selectedItem && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800">Device Details:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedItem.condition}
                  </Badge>
                </div>
                <div className="text-blue-900">
                  {selectedItem.brand} {selectedItem.model} - {selectedItem.variant}, {selectedItem.color}
                  </div>
              </div>
              
              <div className="pt-2 border-t border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">IMEI/Serial Number:</div>
                <div className="font-mono text-lg bg-white px-3 py-2 rounded border border-blue-300 text-blue-900">
                  {selectedItem.imei}
                  </div>
                </div>
              </div>
            )}

          {/* Sale Price and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sale-price">Sale Price (₹)</Label>
              <Input
                id="sale-price"
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Enter sale price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale-date">Date of Sale</Label>
              <Input
                id="sale-date"
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method and Customer Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
          </div>

          {/* Customer Phone and Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Customer Phone</Label>
              <Input
                id="customer-phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter customer phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-address">Customer Address</Label>
              <Input
                id="customer-address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter customer address"
              />
            </div>
          </div>

          <Separator />

          {/* Exchange Toggle */}
          <div className="flex items-center space-x-2">
            <Switch 
              id="exchange" 
              checked={hasExchange} 
              onCheckedChange={setHasExchange} 
            />
            <Label htmlFor="exchange" className="font-medium">
              Exchange Old Phone
            </Label>
          </div>

          {/* Exchange Details */}
          {hasExchange && (
            <div className="bg-gray-50 p-4 rounded-md border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="exchange-model">Exchange Phone Model</Label>
                  <Input
                    id="exchange-model"
                    value={exchangeModel}
                    onChange={(e) => setExchangeModel(e.target.value)}
                    placeholder="e.g. iPhone 11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchange-value">Exchange Value (₹)</Label>
                  <Input
                    id="exchange-value"
                    type="number"
                    min="0"
                    value={exchangeValue}
                    onChange={(e) => setExchangeValue(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="exchange-condition">Condition</Label>
                  <Select value={exchangeCondition} onValueChange={setExchangeCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchange-battery">Battery Health (%)</Label>
                  <Input
                    id="exchange-battery"
                    type="number"
                    min="0"
                    max="100"
                    value={exchangeBatteryHealth}
                    onChange={(e) => setExchangeBatteryHealth(e.target.value)}
                    placeholder="e.g. 85"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchange-imei">Exchange Phone IMEI/Serial</Label>
                <Input 
                  id="exchange-imei" 
                  value={exchangeImei}
                  onChange={(e) => setExchangeImei(e.target.value)}
                  placeholder="Enter IMEI or Serial number" 
                />
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about this sale"
              rows={3}
            />
          </div>

          {/* Sale Summary */}
          {selectedInventory && salePrice && (
            <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200">
              <div className="flex items-center mb-2">
                <Calculator className="h-5 w-5 mr-2 text-emerald-600" />
                <h3 className="font-medium text-lg text-emerald-800">Sale Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Device:</div>
                <div className="font-medium">
                  {selectedItem?.brand} {selectedItem?.model} ({selectedItem?.variant}, {selectedItem?.color})
                </div>

                <div>IMEI/Serial:</div>
                <div className="font-medium font-mono">{selectedItem?.imei}</div>

                <div>Sale Price:</div>
                <div className="font-medium">{formatCurrency(parseFloat(salePrice))}</div>

                {hasExchange && parseFloat(exchangeValue) > 0 && (
                  <>
                    <div>Exchange Value:</div>
                    <div className="font-medium">-{formatCurrency(parseFloat(exchangeValue))}</div>
                  </>
                )}

                <div className="text-base pt-2 font-bold text-emerald-800">Amount to Collect:</div>
                <div className="text-base font-bold pt-2 text-emerald-600">
                  {formatCurrency(parseInt(totalAmount))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-6 border-t">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setOpen(false)} 
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || recordSaleMutation.isPending || !selectedInventory} 
              className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
            >
              {isLoading || recordSaleMutation.isPending ? 'Processing...' : 'Record Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordSaleDialog;
