import { describe, expect, it } from 'vitest';
import { calculateProfit, calculateTotalRevenue, calculateTotalProfit, parseAmount } from '@/lib/calculations';

describe('Dashboard Stats Calculation Verification', () => {
  describe('Manual vs Utility Calculation Consistency', () => {
    const mockSalesData = [
      { final_amount: '25000' },
      { final_amount: '30000.50' },
      { final_amount: '15000' },
    ];

    const mockInventoryData = [
      { purchase_price: '20000', sale_price: '25000', status: 'Sold' },
      { purchase_price: '25000', sale_price: '30000.50', status: 'Sold' },
      { purchase_price: '12000', sale_price: '15000', status: 'Sold' },
      { purchase_price: '18000', sale_price: '22000', status: 'In Stock' },
    ];

    it('should calculate revenue consistently between old and new methods', () => {
      // Old method (what was in the original hook)
      const oldRevenue = mockSalesData.reduce((sum, sale) => 
        sum + parseFloat(sale.final_amount.toString()), 0) || 0;

      // New method using our utilities
      const revenueAmounts = mockSalesData.map(sale => parseAmount(sale.final_amount));
      const newRevenue = calculateTotalRevenue(revenueAmounts);

      expect(newRevenue).toBe(oldRevenue);
      expect(newRevenue).toBe(70000.50);
    });

    it('should calculate profit consistently between old and new methods', () => {
      // Old method (what was in the original hook)
      const oldProfit = mockInventoryData
        .filter(item => item.status === 'Sold')
        .reduce((sum, item) => sum + (
          parseFloat(item.sale_price.toString()) - parseFloat(item.purchase_price.toString())
        ), 0) || 0;

      // New method using our utilities
      const profitData = mockInventoryData
        .filter(item => item.status === 'Sold')
        .map(item => ({
          salePrice: parseAmount(item.sale_price),
          purchasePrice: parseAmount(item.purchase_price)
        }));
      const newProfit = calculateTotalProfit(profitData);

      expect(newProfit).toBe(oldProfit);
      expect(newProfit).toBe(13000.50); // Let's check what the actual calculation is giving us
    });

    it('should maintain precision in complex calculations', () => {
      const precisionData = [
        { purchase_price: '20000.33', sale_price: '25000.99', status: 'Sold' },
        { purchase_price: '25000.25', sale_price: '30000.01', status: 'Sold' },
      ];

      // Using our standardized utilities
      const profitData = precisionData.map(item => ({
        salePrice: parseAmount(item.sale_price),
        purchasePrice: parseAmount(item.purchase_price)
      }));
      
      const totalProfit = calculateTotalProfit(profitData);
      
      // Manual verification:
      // Profit 1: 25000.99 - 20000.33 = 5000.66
      // Profit 2: 30000.01 - 25000.25 = 4999.76
      // Total: 5000.66 + 4999.76 = 10000.42
      expect(totalProfit).toBe(10000.42);
    });

    it('should handle invalid data gracefully', () => {
      const invalidData = [
        { final_amount: 'invalid' },
        { final_amount: null },
        { final_amount: '25000' },
        { final_amount: '' },
      ];

      const revenueAmounts = invalidData.map(sale => parseAmount(sale.final_amount || 0));
      const revenue = calculateTotalRevenue(revenueAmounts);
      
      // Should only count the valid amount
      expect(revenue).toBe(25000);
    });

    it('should exclude non-sold items from profit calculation', () => {
      const mixedData = [
        { purchase_price: '20000', sale_price: '25000', status: 'Sold' },
        { purchase_price: '18000', sale_price: '22000', status: 'In Stock' },
        { purchase_price: '15000', sale_price: '18000', status: 'Damaged' },
        { purchase_price: '12000', sale_price: '16000', status: 'Sold' },
      ];

      const soldItems = mixedData
        .filter(item => item.status === 'Sold')
        .map(item => ({
          salePrice: parseAmount(item.sale_price),
          purchasePrice: parseAmount(item.purchase_price)
        }));

      const profit = calculateTotalProfit(soldItems);
      
      // Should only include sold items: (25000-20000) + (16000-12000) = 9000
      expect(profit).toBe(9000);
    });
  });
});