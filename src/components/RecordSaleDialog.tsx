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
import { useExchangePhones } from '@/hooks/useExchangePhones';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ShoppingCart, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  calculateFinalAmount, 
  formatCurrency, 
  parseAmount, 
  validateMonetaryInput,
  formatIndianCurrency,
  ValidationResult 
} from '@/lib/calculations';

const RecordSaleDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [hasExchange, setHasExchange] = useState(false);
  const [exchangeModel, setExchangeModel] = useState('');
  const [exchangeBrand, setExchangeBrand] = useState('');
  const [exchangeValue, setExchangeValue] = useState('0');
  const [totalAmount, setTotalAmount] = useState('0');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [exchangeCondition, setExchangeCondition] = useState('');
  const [exchangeColor, setExchangeColor] = useState('');
  const [exchangeStorage, setExchangeStorage] = useState('');
  const [exchangeImei, setExchangeImei] = useState('');
  const [exchangeSpecs, setExchangeSpecs] = useState('');
  const [exchangeNotes, setExchangeNotes] = useState('');
  const [notes, setNotes] = useState('');

  const { data: inventory } = useInventory();
  const { addExchangePhone } = useExchangePhones();
  const queryClient = useQueryClient();

  const availableInventory = inventory?.filter(item => item.status === 'In Stock') || [];

  // Set today's date as default
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSaleDate(today);
  }, []);

  // Calculate total amount with proper precision handling
  useEffect(() => {
    if (salePrice) {
      const sale = parseAmount(salePrice);
      const exchange = hasExchange ? parseAmount(exchangeValue) : 0;
      const finalAmount = calculateFinalAmount(sale, exchange);
      setTotalAmount(finalAmount.toString());
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
      // For In Stock items, use the item's intended sale_price, but if it's 0, don't auto-fill
      // This allows users to set their own selling price
      if (item.sale_price && item.sale_price > 0) {
        setSalePrice(formatCurrency(item.sale_price).toString());
      } else {
        // Don't auto-fill if sale_price is 0, let user enter manually
        setSalePrice('');
      }
    } else {
      setSalePrice('');
    }
  };

  // Input validation helper
  const validateInput = (value: string, fieldName: string) => {
    const validation = validateMonetaryInput(value);
    if (!validation.isValid) {
      toast.error(`Invalid ${fieldName}: ${validation.error}`);
      return false;
    }
    return true;
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

      // Use standardized calculation with proper precision
      const saleAmount = parseAmount(salePrice || '0');
      const exchange = hasExchange ? parseAmount(exchangeValue || '0') : 0;
      const finalAmount = calculateFinalAmount(saleAmount, exchange);
      const saleId = `SALE-${Date.now()}`;

      // Create sale record
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          sale_id: saleId,
          customer_id: customerId,
          inventory_id: selectedInventory,
          sale_price: saleAmount,
          discount: hasExchange ? parseAmount(exchangeValue || '0') : 0,
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
          sale_price: saleAmount, // ✅ FIX: Update sale_price in inventory
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
            subtotal: saleAmount,
            discount: hasExchange ? parseAmount(exchangeValue || '0') : 0,
            total_amount: finalAmount,
          });

        if (invoiceError) throw invoiceError;
      }

      // Record exchange phone if applicable
      if (hasExchange && exchangeBrand && exchangeModel) {
        await addExchangePhone({
          sales_id: sale.id,
          brand: exchangeBrand,
          model: exchangeModel,
          condition: exchangeCondition || 'Fair',
          storage: exchangeStorage,
          color: exchangeColor,
          imei: exchangeImei,
          exchange_value: parseAmount(exchangeValue || '0'),
          specifications: exchangeSpecs,
          notes: exchangeNotes,
          added_to_inventory: false,
        });
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
    setExchangeBrand('');
    setExchangeValue('0');
    setTotalAmount('0');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setPaymentMethod('Cash');
    setExchangeCondition('');
    setExchangeColor('');
    setExchangeStorage('');
    setExchangeImei('');
    setExchangeSpecs('');
    setExchangeNotes('');
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
                step="0.01"
                value={salePrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateInput(value, 'sale price')) {
                    setSalePrice(value);
                  } else {
                    setSalePrice(value); // Still set it for user feedback, validation will show error
                  }
                }}
                placeholder="Enter sale price (e.g., 25000.50)"
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
              <h3 className="font-medium text-lg text-gray-900 mb-4">Exchange Phone Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exchange-brand">Brand *</Label>
                  <Input
                    id="exchange-brand"
                    value={exchangeBrand}
                    onChange={(e) => setExchangeBrand(e.target.value)}
                    placeholder="e.g. Apple, Samsung"
                    required={hasExchange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchange-model">Model *</Label>
                  <Input
                    id="exchange-model"
                    value={exchangeModel}
                    onChange={(e) => setExchangeModel(e.target.value)}
                    placeholder="e.g. iPhone 11, Galaxy S21"
                    required={hasExchange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchange-value">Exchange Value (₹)</Label>
                  <Input
                    id="exchange-value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={exchangeValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (validateInput(value, 'exchange value')) {
                        setExchangeValue(value);
                      } else {
                        setExchangeValue(value);
                      }
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exchange-condition">Condition</Label>
                  <Select value={exchangeCondition} onValueChange={setExchangeCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchange-storage">Storage</Label>
                  <Input
                    id="exchange-storage"
                    value={exchangeStorage}
                    onChange={(e) => setExchangeStorage(e.target.value)}
                    placeholder="e.g. 64GB, 128GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchange-color">Color</Label>
                  <Input
                    id="exchange-color"
                    value={exchangeColor}
                    onChange={(e) => setExchangeColor(e.target.value)}
                    placeholder="e.g. Black, White"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchange-imei">IMEI/Serial Number</Label>
                <Input 
                  id="exchange-imei" 
                  value={exchangeImei}
                  onChange={(e) => setExchangeImei(e.target.value)}
                  placeholder="Enter IMEI or Serial number"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchange-specs">Specifications</Label>
                <Textarea
                  id="exchange-specs"
                  value={exchangeSpecs}
                  onChange={(e) => setExchangeSpecs(e.target.value)}
                  placeholder="Additional specs like battery health, screen condition, etc."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchange-notes">Exchange Notes</Label>
                <Textarea
                  id="exchange-notes"
                  value={exchangeNotes}
                  onChange={(e) => setExchangeNotes(e.target.value)}
                  placeholder="Any additional notes about the exchange phone"
                  rows={2}
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
                <div className="font-medium">{formatIndianCurrency(parseAmount(salePrice))}</div>

                {hasExchange && parseAmount(exchangeValue) > 0 && (
                  <>
                    <div>Exchange Value:</div>
                    <div className="font-medium">-{formatIndianCurrency(parseAmount(exchangeValue))}</div>
                  </>
                )}

                <div className="text-base pt-2 font-bold text-emerald-800">Amount to Collect:</div>
                <div className="text-base font-bold pt-2 text-emerald-600">
                  {formatIndianCurrency(parseAmount(totalAmount))}
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
