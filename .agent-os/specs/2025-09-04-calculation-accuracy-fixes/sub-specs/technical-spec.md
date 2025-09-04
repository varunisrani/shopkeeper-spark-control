# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-04-calculation-accuracy-fixes/spec.md

> Created: 2025-09-04
> Version: 1.0.0

## Technical Requirements

### 1. Profit Calculation Standardization
- Create centralized `calculateProfit(salePrice: number, purchasePrice: number): number` utility function
- Replace arbitrary 30% profit assumption in sales chart with actual inventory-based calculations
- Implement consistent profit calculation across `useDashboardStats()` and `useSalesChart()` hooks
- Ensure profit calculations handle edge cases (exchanges, discounts, refunds)

### 2. Data Source Reconciliation  
- Refactor `useDashboardStats()` to use consistent data joins between `sales` and `inventory` tables
- Implement single query approach for revenue and profit calculations using Supabase joins
- Add data validation to ensure sales records match inventory status updates
- Create data integrity checks for revenue vs profit calculation consistency

### 3. Currency Precision Enhancement
- Implement `formatCurrency(amount: number): number` utility with consistent 2-decimal precision
- Replace all `parseFloat()` instances with standardized `parseAmount(value: string | number): number` function
- Fix rounding issues in `RecordSaleDialog.tsx` total amount calculation (line 52)
- Ensure all monetary operations use `Math.round(amount * 100) / 100` for precision

### 4. Real-time Data Consistency
- Update TanStack Query invalidation patterns to refresh all related calculation queries simultaneously
- Implement optimistic updates with rollback for calculation-dependent operations
- Add debouncing for real-time Supabase subscription updates affecting calculations
- Ensure calculation consistency during concurrent sale recordings

### 5. Financial Calculation Utilities
- Create centralized `src/lib/calculations.ts` module with all financial utility functions
- Implement input validation for all monetary calculations (positive numbers, reasonable ranges)
- Add calculation result caching for performance optimization
- Create calculation audit trail for debugging financial discrepancies

### 6. Component Updates
- Update `DashboardStats.tsx` to use new calculation utilities
- Refactor `SalesChart.tsx` to eliminate hardcoded profit margin assumptions  
- Fix `RecordSaleDialog.tsx` exchange value calculation precision issues
- Standardize currency display formatting across all components

### 7. Hook Refactoring
- Modify `useDashboardStats()` hook to use standardized calculation functions
- Update `useSalesChart()` hook to fetch actual profit data instead of calculated estimates
- Implement error handling and fallback values for all calculation hooks
- Add TypeScript interfaces for all calculation-related data structures

### 8. Testing Requirements
- Create unit tests for all financial calculation utility functions
- Implement integration tests comparing dashboard vs chart calculation results  
- Add edge case testing for exchanges, discounts, and refunds
- Create manual testing scenarios for verifying calculation accuracy against database records

## Approach

### Phase 1: Utility Functions Creation
1. Create `src/lib/calculations.ts` with standardized financial calculation functions
2. Implement currency precision utilities with proper rounding
3. Add input validation and error handling for all calculation functions
4. Create TypeScript interfaces for calculation data structures

### Phase 2: Data Layer Refactoring
1. Update Supabase queries to use consistent joins between sales and inventory
2. Implement single-source queries for revenue and profit calculations
3. Add data integrity validation checks
4. Update TanStack Query invalidation patterns for consistency

### Phase 3: Component Integration
1. Update all components to use new calculation utilities
2. Replace hardcoded assumptions with actual data-driven calculations
3. Standardize currency formatting across the application
4. Fix precision issues in dialog components

### Phase 4: Hook Modernization
1. Refactor calculation hooks to use new utilities
2. Implement proper error handling and fallback values
3. Add optimistic updates with rollback capabilities
4. Ensure real-time consistency across concurrent operations

### Phase 5: Testing Implementation
1. Create comprehensive unit test suite for calculation functions
2. Implement integration tests for cross-component calculation consistency
3. Add edge case testing scenarios
4. Create manual testing procedures for validation

## External Dependencies

### Required Libraries
- **Math.js**: For enhanced precision in financial calculations (optional, evaluate need)
- **Decimal.js**: Alternative for arbitrary-precision decimal arithmetic (if needed)

### Database Considerations
- Ensure Supabase query performance with new join operations
- Consider indexing optimization for calculation-heavy queries
- Validate data consistency constraints in database schema

### Testing Dependencies
- **Vitest**: For unit testing calculation utilities
- **React Testing Library**: For component integration tests
- **MSW (Mock Service Worker)**: For API mocking in tests

## Performance Considerations

### Calculation Caching
- Implement memoization for expensive calculation operations
- Cache calculation results at hook level using TanStack Query
- Consider client-side caching for frequently accessed calculations

### Database Optimization
- Optimize Supabase queries to minimize calculation overhead
- Implement efficient data joining strategies
- Consider materialized views for complex calculation aggregations

### Real-time Updates
- Debounce rapid calculation updates to prevent UI flickering
- Implement smart invalidation to update only affected calculations
- Balance real-time accuracy with performance overhead