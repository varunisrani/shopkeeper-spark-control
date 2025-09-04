import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExchangePhones } from '@/hooks/useExchangePhones';
import { Smartphone, Plus, Archive, Search } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/calculations';

const ExchangePhoneManager = () => {
  const { exchangePhones, loading, addToInventory } = useExchangePhones();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPhones = exchangePhones.filter(phone =>
    phone.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (phone.imei && phone.imei.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingPhones = filteredPhones.filter(phone => !phone.added_to_inventory);
  const addedPhones = filteredPhones.filter(phone => phone.added_to_inventory);

  const handleAddToInventory = async (phoneId: string) => {
    try {
      await addToInventory(phoneId);
    } catch (error) {
      console.error('Error adding to inventory:', error);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-4">Loading exchange phones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exchange Phone Management</h2>
          <p className="text-gray-600">Manage phones received in exchange and add them to inventory</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search phones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exchange Phones</p>
                <p className="text-2xl font-bold text-gray-900">{exchangePhones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plus className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Add to Stock</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPhones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Archive className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Added to Inventory</p>
                <p className="text-2xl font-bold text-gray-900">{addedPhones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Phones */}
      {pendingPhones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Addition to Inventory ({pendingPhones.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingPhones.map((phone) => (
              <Card key={phone.id} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{phone.brand} {phone.model}</CardTitle>
                    <Badge className={getConditionColor(phone.condition)}>
                      {phone.condition}
                    </Badge>
                  </div>
                  <CardDescription>
                    Exchange value: {formatIndianCurrency(phone.exchange_value)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {phone.storage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage:</span>
                        <span className="font-medium">{phone.storage}</span>
                      </div>
                    )}
                    {phone.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{phone.color}</span>
                      </div>
                    )}
                    {phone.imei && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">IMEI:</span>
                        <span className="font-mono text-xs">{phone.imei}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Received:</span>
                      <span className="text-xs">{new Date(phone.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {phone.specifications && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium">Specs:</span> {phone.specifications}
                    </div>
                  )}
                  
                  {phone.notes && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <span className="font-medium">Notes:</span> {phone.notes}
                    </div>
                  )}

                  <Button
                    onClick={() => handleAddToInventory(phone.id)}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Inventory
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Added to Inventory */}
      {addedPhones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Added to Inventory ({addedPhones.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addedPhones.map((phone) => (
              <Card key={phone.id} className="border-l-4 border-l-green-500 opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{phone.brand} {phone.model}</CardTitle>
                    <div className="flex space-x-1">
                      <Badge className={getConditionColor(phone.condition)}>
                        {phone.condition}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        In Stock
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Exchange value: {formatIndianCurrency(phone.exchange_value)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {phone.storage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage:</span>
                        <span className="font-medium">{phone.storage}</span>
                      </div>
                    )}
                    {phone.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{phone.color}</span>
                      </div>
                    )}
                    {phone.imei && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">IMEI:</span>
                        <span className="font-mono text-xs">{phone.imei}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Added:</span>
                      <span className="text-xs">{new Date(phone.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredPhones.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exchange phones found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No phones match your search criteria.' : 'Exchange phones will appear here when customers trade in their devices.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExchangePhoneManager;