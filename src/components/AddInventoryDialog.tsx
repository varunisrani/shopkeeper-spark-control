
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useAddInventory, NewInventoryItem } from '@/hooks/useInventory';
import { useSuppliers } from '@/hooks/useSuppliers';

const AddInventoryDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewInventoryItem>({
    brand: '',
    model: '',
    variant: '',
    imei: '',
    purchase_price: 0,
    sale_price: 0,
    condition: 'New',
    battery_health: 100,
    supplier_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
  });

  const { data: suppliers } = useSuppliers();
  const addInventoryMutation = useAddInventory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          brand: '',
          model: '',
          variant: '',
          imei: '',
          purchase_price: 0,
          sale_price: 0,
          condition: 'New',
          battery_health: 100,
          supplier_id: '',
          purchase_date: new Date().toISOString().split('T')[0],
        });
      },
    });
  };

  const handleInputChange = (field: keyof NewInventoryItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand" className="text-sm">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="model" className="text-sm">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="variant" className="text-sm">Variant</Label>
            <Input
              id="variant"
              value={formData.variant}
              onChange={(e) => handleInputChange('variant', e.target.value)}
              placeholder="e.g., 256GB, Graphite"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="imei" className="text-sm">IMEI *</Label>
            <Input
              id="imei"
              value={formData.imei}
              onChange={(e) => handleInputChange('imei', e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_price" className="text-sm">Purchase Price *</Label>
              <Input
                id="purchase_price"
                type="number"
                value={formData.purchase_price}
                onChange={(e) => handleInputChange('purchase_price', parseFloat(e.target.value) || 0)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sale_price" className="text-sm">Sale Price *</Label>
              <Input
                id="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={(e) => handleInputChange('sale_price', parseFloat(e.target.value) || 0)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="condition" className="text-sm">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="battery_health" className="text-sm">Battery Health (%)</Label>
              <Input
                id="battery_health"
                type="number"
                min="0"
                max="100"
                value={formData.battery_health}
                onChange={(e) => handleInputChange('battery_health', parseInt(e.target.value) || 100)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supplier" className="text-sm">Supplier *</Label>
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

          <div>
            <Label htmlFor="purchase_date" className="text-sm">Purchase Date *</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => handleInputChange('purchase_date', e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-black hover:bg-gray-800 w-full sm:w-auto"
              disabled={addInventoryMutation.isPending}
            >
              {addInventoryMutation.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryDialog;
