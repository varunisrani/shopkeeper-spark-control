import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/hooks/useInventory';

interface EditInventoryDialogProps {
  item: InventoryItem;
}

const EditInventoryDialog = ({ item }: EditInventoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    brand: item.brand,
    model: item.model,
    variant: item.variant,
    color: item.color,
    imei: item.imei,
    purchase_price: item.purchase_price,
    condition: item.condition,
    battery_health: item.battery_health,
    warranty_months: item.warranty_months,
    venue: item.venue,
    inward_by: item.inward_by,
    additional_notes: item.additional_notes,
    purchase_date: item.purchase_date,
  });

  const queryClient = useQueryClient();
  const brands = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Nothing', 'Google'];

  const editInventoryMutation = useMutation({
    mutationFn: async (data: Partial<InventoryItem>) => {
      const { error } = await supabase
        .from('inventory')
        .update(data)
        .eq('id', item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item updated successfully!');
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error('Error updating inventory:', error);
      const postgresError = error as unknown as { code?: string; details?: string };
      if (postgresError?.code === '23505' && postgresError?.details?.includes('imei')) {
        toast.error(`IMEI ${formData.imei} already exists in inventory. Please use a different IMEI number.`);
      } else {
        toast.error('Failed to update inventory item. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editInventoryMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InventoryItem, value: string | number) => {
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
          <DialogTitle className="text-xl font-semibold">Edit Inventory Item</DialogTitle>
          <p className="text-sm text-gray-600">Update the details of this inventory item.</p>
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

          {/* Row 4: Purchase Price and Purchase Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="purchase_price" className="text-sm font-medium text-gray-700">Purchase Price (₹)</Label>
              <Input
                id="purchase_price"
                type="number"
                value={formData.purchase_price}
                onChange={(e) => handleInputChange('purchase_price', parseFloat(e.target.value))}
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
                onChange={(e) => handleInputChange('battery_health', parseInt(e.target.value))}
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
                onChange={(e) => handleInputChange('warranty_months', parseInt(e.target.value))}
                placeholder=""
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 6: Venue */}
          <div className="grid grid-cols-1 gap-6">
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
          </div>

          {/* Row 7: Inward By */}
          <div className="grid grid-cols-1 gap-6">
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

          {/* Row 8: Additional Notes */}
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
              disabled={editInventoryMutation.isPending}
            >
              {editInventoryMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryDialog; 