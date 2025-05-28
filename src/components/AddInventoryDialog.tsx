
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
        <Button className="bg-black hover:bg-gray-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="variant">Variant</Label>
            <Input
              id="variant"
              value={formData.variant}
              onChange={(e) => handleInputChange('variant', e.target.value)}
              placeholder="e.g., 256GB, Graphite"
            />
          </div>

          <div>
            <Label htmlFor="imei">IMEI *</Label>
            <Input
              id="imei"
              value={formData.imei}
              onChange={(e) => handleInputChange('imei', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_price">Purchase Price *</Label>
              <Input
                id="purchase_price"
                type="number"
                value={formData.purchase_price}
                onChange={(e) => handleInputChange('purchase_price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sale_price">Sale Price *</Label>
              <Input
                id="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={(e) => handleInputChange('sale_price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
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
              <Label htmlFor="battery_health">Battery Health (%)</Label>
              <Input
                id="battery_health"
                type="number"
                min="0"
                max="100"
                value={formData.battery_health}
                onChange={(e) => handleInputChange('battery_health', parseInt(e.target.value) || 100)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supplier">Supplier *</Label>
            <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange('supplier_id', value)}>
              <SelectTrigger>
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
            <Label htmlFor="purchase_date">Purchase Date *</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => handleInputChange('purchase_date', e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-black hover:bg-gray-800"
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
