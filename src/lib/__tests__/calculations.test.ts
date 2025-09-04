import { describe, expect, it } from 'vitest';
import { 
  calculateProfit, 
  formatCurrency, 
  parseAmount,
  validateMonetaryInput,
  type ProfitCalculation,
  type MonetaryValue
} from '../calculations';

describe('Financial Calculation Utilities', () => {
  describe('calculateProfit', () => {
    it('should calculate profit correctly for positive values', () => {
      const result = calculateProfit(25000, 20000);
      expect(result.profit).toBe(5000);
      expect(result.margin).toBe(25); // (5000/20000) * 100 = 25%
      expect(result.isValid).toBe(true);
    });

    it('should handle zero profit correctly', () => {
      const result = calculateProfit(20000, 20000);
      expect(result.profit).toBe(0);
      expect(result.margin).toBe(0);
      expect(result.isValid).toBe(true);
    });

    it('should handle negative profit (loss)', () => {
      const result = calculateProfit(15000, 20000);
      expect(result.profit).toBe(-5000);
      expect(result.margin).toBe(-25);
      expect(result.isValid).toBe(true);
    });

    it('should handle decimal precision correctly', () => {
      const result = calculateProfit(25000.99, 20000.50);
      expect(result.profit).toBe(5000.49); // 25000.99 - 20000.50 = 5000.49
      expect(result.margin).toBe(25.00); // (5000.49/20000.50) * 100 ≈ 25%
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for negative sale price', () => {
      const result = calculateProfit(-1000, 20000);
      expect(result.isValid).toBe(false);
      expect(result.profit).toBe(0);
      expect(result.margin).toBe(0);
    });

    it('should return invalid for negative purchase price', () => {
      const result = calculateProfit(25000, -1000);
      expect(result.isValid).toBe(false);
      expect(result.profit).toBe(0);
      expect(result.margin).toBe(0);
    });

    it('should handle zero sale price edge case', () => {
      const result = calculateProfit(0, 20000);
      expect(result.profit).toBe(-20000);
      expect(result.margin).toBe(-100);
      expect(result.isValid).toBe(true);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with 2 decimal places', () => {
      expect(formatCurrency(25000)).toBe(25000.00);
      expect(formatCurrency(25000.5)).toBe(25000.50);
      expect(formatCurrency(25000.999)).toBe(25001.00);
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-5000)).toBe(-5000.00);
      expect(formatCurrency(-5000.75)).toBe(-5000.75);
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe(0.00);
    });

    it('should handle very small amounts', () => {
      expect(formatCurrency(0.004)).toBe(0.00);
      expect(formatCurrency(0.005)).toBe(0.01);
    });

    it('should handle large amounts', () => {
      expect(formatCurrency(999999.99)).toBe(999999.99);
      expect(formatCurrency(1000000)).toBe(1000000.00);
    });

    it('should fix floating point precision issues', () => {
      expect(formatCurrency(0.1 + 0.2)).toBe(0.30);
      expect(formatCurrency(25000.1 - 20000.05)).toBe(5000.05);
    });
  });

  describe('parseAmount', () => {
    it('should parse valid string numbers', () => {
      expect(parseAmount('25000')).toBe(25000);
      expect(parseAmount('25000.50')).toBe(25000.50);
      expect(parseAmount('0')).toBe(0);
    });

    it('should parse valid numbers', () => {
      expect(parseAmount(25000)).toBe(25000);
      expect(parseAmount(25000.50)).toBe(25000.50);
      expect(parseAmount(0)).toBe(0);
    });

    it('should handle negative values', () => {
      expect(parseAmount('-5000')).toBe(-5000);
      expect(parseAmount(-5000)).toBe(-5000);
    });

    it('should return 0 for invalid inputs', () => {
      expect(parseAmount('invalid')).toBe(0);
      expect(parseAmount('')).toBe(0);
      expect(parseAmount(null as any)).toBe(0);
      expect(parseAmount(undefined as any)).toBe(0);
      expect(parseAmount(NaN)).toBe(0);
    });

    it('should handle string with spaces', () => {
      expect(parseAmount(' 25000 ')).toBe(25000);
      expect(parseAmount('  25000.50  ')).toBe(25000.50);
    });

    it('should handle comma separators', () => {
      expect(parseAmount('25,000')).toBe(25000);
      expect(parseAmount('25,000.50')).toBe(25000.50);
      expect(parseAmount('1,25,000')).toBe(125000);
    });
  });

  describe('validateMonetaryInput', () => {
    it('should validate positive amounts', () => {
      expect(validateMonetaryInput(25000).isValid).toBe(true);
      expect(validateMonetaryInput(0.01).isValid).toBe(true);
      expect(validateMonetaryInput(999999.99).isValid).toBe(true);
    });

    it('should invalidate negative amounts', () => {
      const result1 = validateMonetaryInput(-1);
      const result2 = validateMonetaryInput(-25000);
      expect(result1.isValid).toBe(false);
      expect(result1.error).toBe('Amount cannot be negative');
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe('Amount cannot be negative');
    });

    it('should validate zero', () => {
      expect(validateMonetaryInput(0).isValid).toBe(true);
    });

    it('should invalidate extremely large amounts', () => {
      const result = validateMonetaryInput(10000000000); // 10 billion
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Amount too large (maximum 10 billion)');
    });

    it('should invalidate NaN and infinity', () => {
      const resultNaN = validateMonetaryInput(NaN);
      const resultInf = validateMonetaryInput(Infinity);
      const resultNegInf = validateMonetaryInput(-Infinity);
      
      expect(resultNaN.isValid).toBe(false);
      expect(resultNaN.error).toBe('Invalid number format');
      expect(resultInf.isValid).toBe(false);
      expect(resultInf.error).toBe('Invalid number format');
      expect(resultNegInf.isValid).toBe(false);
      expect(resultNegInf.error).toBe('Invalid number format');
    });

    it('should validate string inputs', () => {
      expect(validateMonetaryInput('25000').isValid).toBe(true);
      expect(validateMonetaryInput('25,000.50').isValid).toBe(true);
      expect(validateMonetaryInput('').isValid).toBe(true); // Empty string is valid (becomes 0)
      
      const invalidResult = validateMonetaryInput('invalid123');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBe('Only numbers, commas, and periods are allowed');
    });
  });

  describe('Integration tests', () => {
    it('should work together for a complete sale scenario', () => {
      const salePrice = parseAmount('25,000.00');
      const purchasePrice = parseAmount('20000.50');
      
      expect(validateMonetaryInput(salePrice).isValid).toBe(true);
      expect(validateMonetaryInput(purchasePrice).isValid).toBe(true);
      
      const profit = calculateProfit(salePrice, purchasePrice);
      expect(profit.isValid).toBe(true);
      
      const formattedProfit = formatCurrency(profit.profit);
      expect(formattedProfit).toBe(4999.50); // 25000 - 20000.50 = 4999.50
      
      const formattedMargin = formatCurrency(profit.margin);
      expect(formattedMargin).toBe(25.00); // (4999.50/20000.50) * 100 ≈ 25%
    });

    it('should handle exchange scenario', () => {
      const salePrice = parseAmount('25000');
      const purchasePrice = parseAmount('20000');
      const exchangeValue = parseAmount('5000.00');
      
      const finalAmount = formatCurrency(salePrice - exchangeValue);
      expect(finalAmount).toBe(20000.00);
      
      const actualProfit = calculateProfit(salePrice, purchasePrice);
      expect(actualProfit.profit).toBe(5000);
    });

    it('should handle precision in complex calculations', () => {
      // Simulate the problematic calculation from RecordSaleDialog
      const sale = 25000.99;
      const exchange = 5000.50;
      const total = formatCurrency(sale - exchange);
      
      expect(total).toBe(20000.49);
      // Ensure no floating point issues like 20000.48999999...
    });
  });
});