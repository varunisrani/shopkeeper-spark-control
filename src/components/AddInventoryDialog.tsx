
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useAddInventory, NewInventoryItem } from '@/hooks/useInventory';
import { useSuppliers } from '@/hooks/useSuppliers';

const AddInventoryDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewInventoryItem>({
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
    venue: '',
    inward_by: '',
    additional_notes: '',
    supplier_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    sale_date: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    payment_method: 'Cash',
    exchange_old_phone: false,
    additional_sale_notes: '',
  });

  const { data: suppliers } = useSuppliers();
  const addInventoryMutation = useAddInventory();

  const brands = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Nothing', 'Google'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Convert string values to appropriate types for submission
    const submitData = {
      ...formData,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price.toString()) : 0,
      sale_price: formData.sale_price ? parseFloat(formData.sale_price.toString()) : 0,
      battery_health: formData.battery_health ? parseInt(formData.battery_health.toString()) : 100,
      warranty_months: formData.warranty_months ? parseInt(formData.warranty_months.toString()) : 0,
      quantity: formData.quantity ? parseInt(formData.quantity.toString()) : 1,
    };

    addInventoryMutation.mutate(submitData, {
      onSuccess: () => {
        console.log('Inventory item added successfully, closing dialog');
        setOpen(false);
        // Reset form
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
          venue: '',
          inward_by: '',
          additional_notes: '',
          supplier_id: '',
          purchase_date: new Date().toISOString().split('T')[0],
          sale_date: '',
          customer_name: '',
          customer_phone: '',
          customer_address: '',
          payment_method: 'Cash',
          exchange_old_phone: false,
          additional_sale_notes: '',
        });
      },
    });
  };

  const handleInputChange = (field: keyof NewInventoryItem, value: string) => {
    console.log(`Updating ${field}:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: keyof NewInventoryItem, checked: boolean) => {
    console.log(`Updating ${field}:`, checked);
    setFormData(prev => ({
      ...prev,
      [field]: checked,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Inventory</DialogTitle>
          <p className="text-sm text-gray-600">Enter the details of the new mobile phone to add to your inventory.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Brand and Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="brand" className="text-sm font-medium text-gray-700">Brand</Label>
              <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="model" className="text-sm font-medium text-gray-700">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g. iPhone 13 Pro"
                className="mt-1"
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
                placeholder="e.g. 256GB"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="color" className="text-sm font-medium text-gray-700">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="e.g. Graphite"
                className="mt-1"
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
                placeholder="Enter IMEI or Serial number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="condition" className="text-sm font-medium text-gray-700">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
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
                min="0"
                max="100"
                value={formData.battery_health}
                onChange={(e) => handleInputChange('battery_health', e.target.value)}
                placeholder=""
                className="mt-1"
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
              />
            </div>
          </div>

          {/* Row 6: Quantity and Purchase Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder=""
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="purchase_date" className="text-sm font-medium text-gray-700">Date of Purchase</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 7: Sale Date and Customer Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Row 8: Customer Phone and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <Label htmlFor="payment_method" className="text-sm font-medium text-gray-700">Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment method" />
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
              />
            </div>
          </div>

          {/* Row 11: Supplier */}
          <div>
            <Label htmlFor="supplier_id" className="text-sm font-medium text-gray-700">Supplier</Label>
            <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange('supplier_id', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers?.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 12: Exchange Old Phone */}
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

          {/* Row 13: Additional Notes */}
          <div>
            <Label htmlFor="additional_notes" className="text-sm font-medium text-gray-700">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              value={formData.additional_notes}
              onChange={(e) => handleInputChange('additional_notes', e.target.value)}
              placeholder="Any additional information about this product"
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Row 14: Additional Sale Notes */}
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
              disabled={addInventoryMutation.isPending}
            >
              {addInventoryMutation.isPending ? 'Adding...' : 'Add to Inventory'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryDialog;
