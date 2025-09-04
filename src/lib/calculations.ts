/**
 * Financial Calculation Utilities for ShopKeeper Spark
 * 
 * This module provides standardized calculation functions for the mobile shop
 * management system, ensuring consistent financial calculations across all
 * components and eliminating calculation discrepancies.
 */

// TypeScript interfaces for calculation data structures
export interface ProfitCalculation {
  profit: number;
  margin: number; // Percentage
  isValid: boolean;
}

export interface MonetaryValue {
  amount: number;
  formatted: string;
  isValid: boolean;
}

export interface SaleCalculation {
  salePrice: number;
  purchasePrice: number;
  exchangeValue: number;
  finalAmount: number;
  profit: number;
  profitMargin: number;
}

export interface CalculationCache {
  [key: string]: any;
}

// Simple in-memory cache for calculation results
const calculationCache: CalculationCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Calculates profit and profit margin from sale and purchase prices
 * @param salePrice - The selling price of the item
 * @param purchasePrice - The cost/purchase price of the item
 * @returns ProfitCalculation object with profit, margin, and validity
 */
export function calculateProfit(salePrice: number, purchasePrice: number): ProfitCalculation {
  // Validate inputs
  if (salePrice < 0 || purchasePrice < 0) {
    return {
      profit: 0,
      margin: 0,
      isValid: false
    };
  }

  const profit = formatCurrency(salePrice - purchasePrice);
  
  // Calculate profit margin as percentage
  // Handle division by zero when purchase price is 0
  let margin = 0;
  if (purchasePrice !== 0) {
    margin = formatCurrency((profit / purchasePrice) * 100);
  } else if (salePrice > 0) {
    // If purchase price is 0 and sale price is positive, it's 100% margin
    margin = 100;
  } else {
    // Both prices are 0
    margin = 0;
  }

  return {
    profit,
    margin,
    isValid: true
  };
}

/**
 * Formats currency amounts with consistent 2-decimal precision
 * Fixes floating point precision issues using proper rounding
 * @param amount - The amount to format
 * @returns Formatted amount with exactly 2 decimal places
 */
export function formatCurrency(amount: number): number {
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
    return 0.00;
  }
  
  // Use Math.round to fix floating point precision issues
  return Math.round(amount * 100) / 100;
}

/**
 * Parses string or number input into a valid number
 * Handles various input formats including comma separators
 * @param value - String or number to parse
 * @returns Parsed number or 0 for invalid inputs
 */
export function parseAmount(value: string | number): number {
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) {
      return 0;
    }
    return value;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  // Remove spaces and handle empty strings
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  // Remove comma separators (handle Indian number format)
  const cleaned = trimmed.replace(/,/g, '');
  
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed) || !isFinite(parsed)) {
    return 0;
  }
  
  return parsed;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates monetary input values (supports both string and number)
 * @param value - Value to validate (string or number)
 * @returns ValidationResult with isValid flag and error message
 */
export function validateMonetaryInput(value: string | number): ValidationResult {
  // Handle string inputs by parsing them first
  let amount: number;
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return { isValid: true }; // Empty string is valid (will be treated as 0)
    }
    
    // Check for non-numeric characters (except comma, period, and digits)
    if (!/^[\d,. ]+$/.test(trimmed)) {
      return { 
        isValid: false, 
        error: 'Only numbers, commas, and periods are allowed' 
      };
    }
    
    amount = parseAmount(trimmed);
  } else if (typeof value === 'number') {
    amount = value;
  } else {
    return { 
      isValid: false, 
      error: 'Value must be a number or string' 
    };
  }

  // Check for invalid numbers
  if (isNaN(amount) || !isFinite(amount)) {
    return { 
      isValid: false, 
      error: 'Invalid number format' 
    };
  }

  // Reject negative amounts
  if (amount < 0) {
    return { 
      isValid: false, 
      error: 'Amount cannot be negative' 
    };
  }

  // Reject extremely large amounts (10 billion or more)
  if (amount >= 10000000000) {
    return { 
      isValid: false, 
      error: 'Amount too large (maximum 10 billion)' 
    };
  }

  return { isValid: true };
}

/**
 * Calculates final sale amount including exchanges
 * @param salePrice - Base sale price
 * @param exchangeValue - Value of exchanged item (optional)
 * @returns Final amount after exchange
 */
export function calculateFinalAmount(salePrice: number, exchangeValue: number = 0): number {
  const saleValidation = validateMonetaryInput(salePrice);
  const exchangeValidation = validateMonetaryInput(exchangeValue);
  
  const validSalePrice = saleValidation.isValid ? salePrice : 0;
  const validExchangeValue = exchangeValidation.isValid ? exchangeValue : 0;
  
  return formatCurrency(validSalePrice - validExchangeValue);
}

/**
 * Comprehensive sale calculation including all financial aspects
 * @param salePrice - Selling price
 * @param purchasePrice - Purchase/cost price
 * @param exchangeValue - Exchange value (default 0)
 * @returns Complete sale calculation breakdown
 */
export function calculateSaleBreakdown(
  salePrice: number, 
  purchasePrice: number, 
  exchangeValue: number = 0
): SaleCalculation {
  const validSalePrice = parseAmount(salePrice);
  const validPurchasePrice = parseAmount(purchasePrice);
  const validExchangeValue = parseAmount(exchangeValue);
  
  const finalAmount = calculateFinalAmount(validSalePrice, validExchangeValue);
  const profitCalc = calculateProfit(validSalePrice, validPurchasePrice);
  
  return {
    salePrice: formatCurrency(validSalePrice),
    purchasePrice: formatCurrency(validPurchasePrice),
    exchangeValue: formatCurrency(validExchangeValue),
    finalAmount,
    profit: profitCalc.profit,
    profitMargin: profitCalc.margin
  };
}

/**
 * Cached calculation wrapper for performance optimization
 * @param key - Cache key
 * @param calculationFn - Function to execute if not cached
 * @returns Cached or computed result
 */
export function cachedCalculation<T>(key: string, calculationFn: () => T): T {
  const now = Date.now();
  const cached = calculationCache[key];
  
  // Check if cached result exists and is not expired
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.result;
  }
  
  // Calculate new result
  const result = calculationFn();
  
  // Store in cache with timestamp
  calculationCache[key] = {
    result,
    timestamp: now
  };
  
  return result;
}

/**
 * Clears calculation cache (useful for testing)
 */
export function clearCalculationCache(): void {
  Object.keys(calculationCache).forEach(key => {
    delete calculationCache[key];
  });
}

/**
 * Formats amount for Indian currency display (₹)
 * @param amount - Amount to format
 * @returns Formatted string with Indian currency symbol
 */
export function formatIndianCurrency(amount: number): string {
  const formattedAmount = formatCurrency(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(formattedAmount);
}

/**
 * Calculates total revenue from an array of sale amounts
 * @param sales - Array of sale final amounts
 * @returns Total revenue with proper precision
 */
export function calculateTotalRevenue(sales: number[]): number {
  if (!Array.isArray(sales) || sales.length === 0) {
    return 0;
  }
  
  const total = sales.reduce((sum, sale) => {
    const validSale = parseAmount(sale);
    return sum + validSale;
  }, 0);
  
  return formatCurrency(total);
}

/**
 * Calculates total profit from sales and inventory data
 * @param salesData - Array of {salePrice, purchasePrice} objects
 * @returns Total profit with proper precision
 */
export function calculateTotalProfit(salesData: Array<{salePrice: number, purchasePrice: number}>): number {
  if (!Array.isArray(salesData) || salesData.length === 0) {
    return 0;
  }
  
  const totalProfit = salesData.reduce((sum, item) => {
    const profitCalc = calculateProfit(item.salePrice, item.purchasePrice);
    return sum + (profitCalc.isValid ? profitCalc.profit : 0);
  }, 0);
  
  return formatCurrency(totalProfit);
}