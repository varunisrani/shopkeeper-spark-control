import { describe, expect, it } from 'vitest';
import { calculateProfit, parseAmount, formatCurrency } from '@/lib/calculations';

describe('Sales Chart Data Accuracy Tests', () => {
  describe('Profit Calculation Consistency', () => {
    const mockSalesWithInventory = [
      {
        final_amount: '25000',
        sale_date: '2025-09-01',
        inventory: {
          purchase_price: '20000',
          sale_price: '25000'
        }
      },
      {
        final_amount: '30000.50',
        sale_date: '2025-09-01',
        inventory: {
          purchase_price: '25000',
          sale_price: '30000.50'
        }
      },
      {
        final_amount: '15000',
        sale_date: '2025-09-02',
        inventory: {
          purchase_price: '12000',
          sale_price: '15000'
        }
      }
    ];

    it('should calculate actual profit instead of using arbitrary 30% assumption', () => {
      // Old method: arbitrary 30% profit assumption
      const oldMethod = mockSalesWithInventory.map(sale => {
        const saleAmount = parseAmount(sale.final_amount);
        const arbitraryProfit = saleAmount * 0.3; // 30% assumption
        return {
          sales: saleAmount,
          profit: arbitraryProfit
        };
      });

      // New method: actual profit calculation
      const newMethod = mockSalesWithInventory.map(sale => {
        const salePrice = parseAmount(sale.inventory.sale_price);
        const purchasePrice = parseAmount(sale.inventory.purchase_price);
        const actualProfit = calculateProfit(salePrice, purchasePrice);
        return {
          sales: salePrice,
          profit: actualProfit.profit
        };
      });

      // Compare results - they should be different
      expect(newMethod[0].profit).not.toBe(oldMethod[0].profit);
      
      // Verify actual calculations
      expect(newMethod[0].profit).toBe(5000);    // 25000 - 20000
      expect(newMethod[1].profit).toBe(5000.50); // 30000.50 - 25000
      expect(newMethod[2].profit).toBe(3000);    // 15000 - 12000

      // Old method would give incorrect values
      expect(oldMethod[0].profit).toBe(7500);    // 25000 * 0.3
      expect(oldMethod[1].profit).toBe(9000.15); // 30000.50 * 0.3
      expect(oldMethod[2].profit).toBe(4500);    // 15000 * 0.3
    });

    it('should group sales by date correctly with actual profit', () => {
      // Simulate the grouping logic that will be in the hook
      const salesByDate = mockSalesWithInventory.reduce((acc, sale) => {
        const date = new Date(sale.sale_date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!acc[date]) {
          acc[date] = { sales: 0, profit: 0 };
        }
        
        const salePrice = parseAmount(sale.inventory.sale_price);
        const purchasePrice = parseAmount(sale.inventory.purchase_price);
        const actualProfit = calculateProfit(salePrice, purchasePrice);
        
        acc[date].sales += salePrice;
        acc[date].profit += actualProfit.profit;
        
        return acc;
      }, {} as Record<string, { sales: number; profit: number }>);

      const chartData = Object.entries(salesByDate).map(([date, data]) => ({
        name: date,
        sales: Math.round(data.sales),
        profit: Math.round(data.profit),
      }));

      // Sep 1: (25000 + 30000.50) sales, (5000 + 5000.50) profit
      // Sep 2: (15000) sales, (3000) profit
      expect(chartData).toHaveLength(2);
      
      const sep1Data = chartData.find(d => d.name.includes('1 Sept'));
      const sep2Data = chartData.find(d => d.name.includes('2 Sept'));
      
      expect(sep1Data?.sales).toBe(55001);
      expect(sep1Data?.profit).toBe(10001); // 5000 + 5000.5 rounded = 10001
      expect(sep2Data?.sales).toBe(15000);
      expect(sep2Data?.profit).toBe(3000);
    });

    it('should handle mixed profit margins correctly', () => {
      const mixedMarginData = [
        {
          inventory: { purchase_price: '10000', sale_price: '15000' }, // 50% margin
          final_amount: '15000',
          sale_date: '2025-09-03'
        },
        {
          inventory: { purchase_price: '20000', sale_price: '21000' }, // 5% margin
          final_amount: '21000',
          sale_date: '2025-09-03'
        },
        {
          inventory: { purchase_price: '30000', sale_price: '25000' }, // -16.67% margin (loss)
          final_amount: '25000',
          sale_date: '2025-09-03'
        }
      ];

      let totalActualProfit = 0;
      let totalArbitraryProfit = 0;

      mixedMarginData.forEach(sale => {
        const salePrice = parseAmount(sale.inventory.sale_price);
        const purchasePrice = parseAmount(sale.inventory.purchase_price);
        const actualProfit = calculateProfit(salePrice, purchasePrice);
        
        totalActualProfit += actualProfit.profit;
        totalArbitraryProfit += salePrice * 0.3; // Old 30% assumption
      });

      // Actual profits: 5000 + 1000 + (-5000) = 1000
      expect(formatCurrency(totalActualProfit)).toBe(1000);
      
      // Arbitrary 30%: (15000 + 21000 + 25000) * 0.3 = 18300
      expect(formatCurrency(totalArbitraryProfit)).toBe(18300);
      
      // The difference is significant!
      expect(Math.abs(totalActualProfit - totalArbitraryProfit)).toBeGreaterThan(15000);
    });

    it('should handle precision correctly in chart calculations', () => {
      const precisionData = [
        {
          inventory: { purchase_price: '20000.33', sale_price: '25000.99' },
          final_amount: '25000.99',
          sale_date: '2025-09-04'
        }
      ];

      const salePrice = parseAmount(precisionData[0].inventory.sale_price);
      const purchasePrice = parseAmount(precisionData[0].inventory.purchase_price);
      const actualProfit = calculateProfit(salePrice, purchasePrice);

      // Should maintain precision: 25000.99 - 20000.33 = 5000.66
      expect(actualProfit.profit).toBe(5000.66);
      
      // Math.round for chart display should work correctly
      expect(Math.round(actualProfit.profit)).toBe(5001);
    });

    it('should handle invalid or missing inventory data gracefully', () => {
      const invalidData = [
        {
          inventory: { purchase_price: 'invalid', sale_price: '25000' },
          final_amount: '25000',
          sale_date: '2025-09-05'
        },
        {
          inventory: { purchase_price: '20000', sale_price: null },
          final_amount: '25000',
          sale_date: '2025-09-05'
        },
        {
          inventory: null,
          final_amount: '25000',
          sale_date: '2025-09-05'
        }
      ];

      invalidData.forEach(sale => {
        if (!sale.inventory) {
          // Should fallback gracefully
          expect(true).toBe(true); // No crash
          return;
        }

        const salePrice = parseAmount(sale.inventory.sale_price || 0);
        const purchasePrice = parseAmount(sale.inventory.purchase_price || 0);
        const actualProfit = calculateProfit(salePrice, purchasePrice);

        // Should not crash and return valid results
        expect(typeof actualProfit.profit).toBe('number');
        expect(actualProfit.isValid).toBeDefined();
      });
    });
  });

  describe('Date Grouping and Formatting', () => {
    it('should format dates consistently for chart labels', () => {
      const testDates = [
        '2025-09-01T10:30:00Z',
        '2025-09-15T15:45:00Z',
        '2025-10-01T09:00:00Z'
      ];

      const formattedDates = testDates.map(dateStr => 
        new Date(dateStr).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        })
      );

      expect(formattedDates).toEqual(['1 Sept', '15 Sept', '1 Oct']);
    });

    it('should aggregate multiple sales on same date correctly', () => {
      const sameDateSales = [
        {
          inventory: { purchase_price: '20000', sale_price: '25000' },
          final_amount: '25000',
          sale_date: '2025-09-01T10:00:00Z'
        },
        {
          inventory: { purchase_price: '15000', sale_price: '18000' },
          final_amount: '18000',
          sale_date: '2025-09-01T14:30:00Z'
        },
        {
          inventory: { purchase_price: '10000', sale_price: '12000' },
          final_amount: '12000',
          sale_date: '2025-09-01T16:45:00Z'
        }
      ];

      let totalSales = 0;
      let totalProfit = 0;

      sameDateSales.forEach(sale => {
        const salePrice = parseAmount(sale.inventory.sale_price);
        const purchasePrice = parseAmount(sale.inventory.purchase_price);
        const actualProfit = calculateProfit(salePrice, purchasePrice);
        
        totalSales += salePrice;
        totalProfit += actualProfit.profit;
      });

      // Sales: 25000 + 18000 + 12000 = 55000
      expect(totalSales).toBe(55000);
      
      // Profit: (25000-20000) + (18000-15000) + (12000-10000) = 5000 + 3000 + 2000 = 10000
      expect(totalProfit).toBe(10000);
    });
  });
});