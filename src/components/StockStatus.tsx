
import React, { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StockStatus = () => {
  const { data: inventory, isLoading } = useInventory();
  const [brandFilter, setBrandFilter] = useState('');

  // Group inventory by brand and model for stock counting
  const stockData = inventory?.reduce((acc, item) => {
    const key = `${item.brand}-${item.model}`;
    if (!acc[key]) {
      acc[key] = {
        brand: item.brand,
        model: item.model,
        items: [],
        inStockCount: 0,
        totalProfit: 0,
        avgPurchasePrice: 0,
        avgSalePrice: 0
      };
    }
    
    acc[key].items.push(item);
    if (item.status === 'In Stock') {
      acc[key].inStockCount++;
    }
    
    const profit = parseFloat(item.sale_price.toString()) - parseFloat(item.purchase_price.toString());
    acc[key].totalProfit += profit;
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and calculate averages
  const stockArray = stockData ? Object.values(stockData).map((stock: any) => {
    const totalItems = stock.items.length;
    const avgPurchasePrice = stock.items.reduce((sum: number, item: any) => 
      sum + parseFloat(item.purchase_price.toString()), 0) / totalItems;
    const avgSalePrice = stock.items.reduce((sum: number, item: any) => 
      sum + parseFloat(item.sale_price.toString()), 0) / totalItems;
    const avgProfit = avgSalePrice - avgPurchasePrice;
    const profitMargin = ((avgProfit / avgPurchasePrice) * 100);
    
    return {
      ...stock,
      avgPurchasePrice,
      avgSalePrice,
      avgProfit,
      profitMargin
    };
  }) : [];

  // Filter by brand
  const filteredStock = stockArray.filter(stock =>
    stock.brand.toLowerCase().includes(brandFilter.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
        <div className="mb-4 sm:mb-6">
          <Skeleton className="h-6 sm:h-7 w-32 sm:w-40 mb-2" />
          <Skeleton className="h-4 w-48 sm:w-64" />
        </div>
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">Stock Status</h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">Current inventory levels and pricing information</p>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Filter by brand..."
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="max-w-xs border-slate-300 focus:border-blue-500"
        />
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredStock.map((stock, index) => (
          <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-slate-900">{stock.brand}</h4>
                <p className="text-sm text-slate-700">{stock.model}</p>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              >
                In Stock
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Purchase:</span>
                <div className="font-medium">₹{stock.avgPurchasePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div>
                <span className="text-slate-600">Sale:</span>
                <div className="font-medium">₹{stock.avgSalePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div>
                <span className="text-slate-600">Stock:</span>
                <div className="font-bold text-blue-600">{stock.inStockCount}</div>
              </div>
              <div>
                <span className="text-slate-600">Profit:</span>
                <div className="text-emerald-600 font-medium">
                  ₹{stock.avgProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  <div className="text-xs text-slate-500">
                    Margin: {stock.profitMargin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-slate-700 font-semibold">
                <input type="checkbox" className="mr-2" />
                Brand
              </TableHead>
              <TableHead className="text-slate-700 font-semibold">
                Model
                <span className="ml-1 text-slate-400">↕</span>
              </TableHead>
              <TableHead className="text-slate-700 font-semibold">Purchase Price</TableHead>
              <TableHead className="text-slate-700 font-semibold">Sale Price</TableHead>
              <TableHead className="text-slate-700 font-semibold">Stock</TableHead>
              <TableHead className="text-slate-700 font-semibold">Status & Profit</TableHead>
              <TableHead className="text-slate-700 font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStock.map((stock, index) => (
              <TableRow key={index} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    {stock.brand}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{stock.model}</TableCell>
                <TableCell>₹{stock.avgPurchasePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</TableCell>
                <TableCell className="font-semibold">₹{stock.avgSalePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</TableCell>
                <TableCell>
                  <span className="text-lg font-bold text-blue-600">{stock.inStockCount}</span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge 
                      variant="secondary" 
                      className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-3 py-1"
                    >
                      In Stock
                    </Badge>
                    <div className="text-sm text-emerald-600 font-medium">
                      Profit: ₹{stock.avgProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-slate-500">
                      Margin: {stock.profitMargin.toFixed(1)}%
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                    <span className="text-lg">⋯</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredStock.length === 0 && !isLoading && (
        <div className="text-center py-8 text-slate-500">
          No stock data available
        </div>
      )}
    </div>
  );
};

export default StockStatus;
