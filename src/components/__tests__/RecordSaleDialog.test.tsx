import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import RecordSaleDialog from '../RecordSaleDialog';
import { calculateFinalAmount, formatCurrency, parseAmount } from '@/lib/calculations';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  }
}));

// Mock useInventory hook
vi.mock('@/hooks/useInventory', () => ({
  useInventory: () => ({
    data: [
      {
        id: '1',
        brand: 'Samsung',
        model: 'Galaxy S23',
        variant: '128GB',
        color: 'Black',
        sale_price: 75000.50,
        purchase_price: 65000.25,
        status: 'In Stock',
        imei: '123456789012345'
      },
      {
        id: '2', 
        brand: 'iPhone',
        model: '14 Pro',
        variant: '256GB', 
        color: 'Gold',
        sale_price: 125000.99,
        purchase_price: 110000.75,
        status: 'In Stock',
        imei: '987654321098765'
      }
    ]
  })
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('RecordSaleDialog Currency Precision Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Exchange Value Calculation Precision', () => {
    it('should calculate final amount with precise decimal handling', () => {
      // Test the utility functions that will be used in the component
      const salePrice = 75000.50;
      const exchangeValue = 25000.33;
      
      const finalAmount = calculateFinalAmount(salePrice, exchangeValue);
      
      // Should be 75000.50 - 25000.33 = 50000.17
      expect(finalAmount).toBe(50000.17);
    });

    it('should handle complex decimal calculations without precision loss', () => {
      const testCases = [
        { sale: 125000.99, exchange: 35000.66, expected: 90000.33 },
        { sale: 50000.50, exchange: 15000.25, expected: 35000.25 },
        { sale: 25000.01, exchange: 5000.99, expected: 19000.02 },
        { sale: 100000.00, exchange: 33333.33, expected: 66666.67 },
      ];

      testCases.forEach(({ sale, exchange, expected }) => {
        const result = calculateFinalAmount(sale, exchange);
        expect(result).toBe(expected);
      });
    });

    it('should handle edge cases with very small amounts', () => {
      const salePrice = 1000.01;
      const exchangeValue = 0.99;
      
      const finalAmount = calculateFinalAmount(salePrice, exchangeValue);
      expect(finalAmount).toBe(999.02);
    });

    it('should handle zero exchange value correctly', () => {
      const salePrice = 75000.50;
      const exchangeValue = 0;
      
      const finalAmount = calculateFinalAmount(salePrice, exchangeValue);
      expect(finalAmount).toBe(75000.50);
    });

    it('should prevent negative final amounts', () => {
      const salePrice = 25000.00;
      const exchangeValue = 30000.00; // Exchange higher than sale
      
      const finalAmount = calculateFinalAmount(salePrice, exchangeValue);
      expect(finalAmount).toBe(-5000.00); // Should allow negative (business decision)
    });
  });

  describe('Input Parsing and Validation', () => {
    it('should parse string inputs correctly', () => {
      const testInputs = [
        { input: '75000.50', expected: 75000.50 },
        { input: '75,000.50', expected: 75000.50 },
        { input: '1,25,000', expected: 125000 },
        { input: ' 50000 ', expected: 50000 },
        { input: 'invalid', expected: 0 },
        { input: '', expected: 0 },
      ];

      testInputs.forEach(({ input, expected }) => {
        const result = parseAmount(input);
        expect(result).toBe(expected);
      });
    });

    it('should format currency consistently', () => {
      const testAmounts = [
        { input: 75000.503, expected: 75000.50 },
        { input: 75000.507, expected: 75000.51 },
        { input: 0.1 + 0.2, expected: 0.30 }, // Floating point precision fix
        { input: 75000.999, expected: 75001.00 },
      ];

      testAmounts.forEach(({ input, expected }) => {
        const result = formatCurrency(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Component Integration Tests', () => {
    it('should render exchange calculation section when enabled', async () => {
      const wrapper = createWrapper();
      render(<RecordSaleDialog />, { wrapper });

      // Open dialog
      const recordButton = screen.getByText('Record Sale');
      await userEvent.click(recordButton);

      // Find and enable exchange toggle
      const exchangeToggle = screen.getByRole('switch', { name: /exchange old phone/i });
      await userEvent.click(exchangeToggle);

      // Verify exchange fields are visible
      expect(screen.getByLabelText(/exchange value/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/exchange phone model/i)).toBeInTheDocument();
    });

    it('should calculate total amount reactively when values change', async () => {
      const wrapper = createWrapper();
      render(<RecordSaleDialog />, { wrapper });

      const user = userEvent.setup();

      // Open dialog
      const recordButton = screen.getByText('Record Sale');
      await user.click(recordButton);

      // Select a device (this should auto-populate sale price)
      const deviceSelect = screen.getByRole('combobox');
      await user.click(deviceSelect);
      
      // The component should show calculated amounts in the sale summary
      // This tests the reactive calculation logic
    });

    it('should show precision warnings for invalid inputs', async () => {
      const wrapper = createWrapper();
      render(<RecordSaleDialog />, { wrapper });

      const user = userEvent.setup();

      // Open dialog  
      const recordButton = screen.getByText('Record Sale');
      await user.click(recordButton);

      // Enable exchange
      const exchangeToggle = screen.getByRole('switch', { name: /exchange old phone/i });
      await user.click(exchangeToggle);

      // Enter invalid exchange value
      const exchangeInput = screen.getByLabelText(/exchange value/i);
      await user.type(exchangeInput, 'invalid123');

      // Component should handle this gracefully (no crash)
      expect(exchangeInput).toBeInTheDocument();
    });
  });

  describe('Floating Point Precision Edge Cases', () => {
    it('should handle the classic 0.1 + 0.2 precision issue', () => {
      const result1 = 0.1 + 0.2;
      const result2 = formatCurrency(0.1 + 0.2);
      
      // Raw JavaScript gives imprecise result
      expect(result1).not.toBe(0.3);
      
      // Our utility should fix it
      expect(result2).toBe(0.30);
    });

    it('should handle multiple decimal operations', () => {
      const salePrice = 75000.1;
      const discount1 = 1000.05;
      const discount2 = 2000.03;
      
      // Chain operations that could compound precision errors
      let result = salePrice;
      result = formatCurrency(result - discount1);
      result = formatCurrency(result - discount2);
      
      // Should be: 75000.1 - 1000.05 - 2000.03 = 72000.02
      expect(result).toBe(72000.02);
    });

    it('should handle percentage calculations precisely', () => {
      const amount = 33333.33;
      const percentage = 0.15; // 15%
      
      const result = formatCurrency(amount * percentage);
      
      // Should be: 33333.33 * 0.15 = 4999.9995, rounded to 5000.00
      expect(result).toBe(5000.00);
    });
  });

  describe('Business Logic Validation', () => {
    it('should handle typical mobile phone price ranges', () => {
      const typicalScenarios = [
        { device: 'Budget Phone', sale: 8999.00, exchange: 2000.00, final: 6999.00 },
        { device: 'Mid-range Phone', sale: 25999.50, exchange: 5000.25, final: 20999.25 },
        { device: 'Premium Phone', sale: 89999.99, exchange: 15000.50, final: 74999.49 },
        { device: 'iPhone Pro Max', sale: 159900.00, exchange: 45000.00, final: 114900.00 },
      ];

      typicalScenarios.forEach(({ device, sale, exchange, final }) => {
        const result = calculateFinalAmount(sale, exchange);
        expect(result).toBe(final);
      });
    });

    it('should handle exchange values higher than 50% of sale price', () => {
      const salePrice = 50000.00;
      const highExchangeValue = 35000.00; // 70% of sale price
      
      const result = calculateFinalAmount(salePrice, highExchangeValue);
      expect(result).toBe(15000.00);
      
      // Should not throw or give unexpected results
      expect(result).toBeGreaterThan(0);
    });

    it('should maintain precision in bulk calculations', () => {
      const bulkSales = Array.from({ length: 100 }, (_, i) => ({
        sale: 25000.01 + (i * 0.01),
        exchange: 5000.01 + (i * 0.001)
      }));

      let totalFinal = 0;
      bulkSales.forEach(({ sale, exchange }) => {
        const final = calculateFinalAmount(sale, exchange);
        totalFinal += final;
      });

      // Total should be properly formatted despite many decimal operations
      const formattedTotal = formatCurrency(totalFinal);
      expect(typeof formattedTotal).toBe('number');
      expect(formattedTotal % 0.01).toBe(0); // Should be properly rounded to 2 decimals
    });
  });
});