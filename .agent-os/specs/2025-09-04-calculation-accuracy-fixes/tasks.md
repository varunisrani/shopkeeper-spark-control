# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/specs/2025-09-04-calculation-accuracy-fixes/spec.md

> Created: 2025-09-04
> Status: Ready for Implementation

## Tasks

- [x] 1. Create Financial Calculation Utilities
  - [x] 1.1 Write unit tests for calculation utility functions
  - [x] 1.2 Create src/lib/calculations.ts module with calculateProfit function
  - [x] 1.3 Implement formatCurrency and parseAmount utility functions
  - [x] 1.4 Add input validation for monetary calculations
  - [x] 1.5 Implement calculation result caching for performance
  - [x] 1.6 Add TypeScript interfaces for calculation data structures
  - [x] 1.7 Verify all calculation utility tests pass

- [x] 2. Fix Dashboard Stats Calculation Issues
  - [x] 2.1 Write integration tests comparing dashboard vs manual calculations
  - [x] 2.2 Refactor useDashboardStats hook to use standardized calculation functions
  - [x] 2.3 Implement consistent data joins between sales and inventory tables
  - [x] 2.4 Replace parseFloat instances with standardized parseAmount function
  - [x] 2.5 Update DashboardStats component to use new calculation utilities
  - [x] 2.6 Add error handling and fallback values for calculation hooks
  - [x] 2.7 Verify dashboard stats display accurate profit calculations

- [x] 3. Fix Sales Chart Profit Calculation
  - [x] 3.1 Write tests for sales chart data accuracy against database records
  - [x] 3.2 Remove arbitrary 30% profit assumption from useSalesChart hook
  - [x] 3.3 Implement actual inventory-based profit calculations in sales chart
  - [x] 3.4 Update SalesChart component to use standardized calculation utilities
  - [x] 3.5 Ensure sales chart data matches dashboard profit calculations
  - [x] 3.6 Add data validation for sales chart calculations
  - [x] 3.7 Verify sales chart shows consistent profit data with dashboard

- [x] 4. Fix Currency Precision in Sale Recording
  - [x] 4.1 Write tests for exchange value calculation precision
  - [x] 4.2 Fix RecordSaleDialog.tsx total amount calculation rounding issues (line 52)
  - [x] 4.3 Implement Math.round(amount * 100) / 100 for all monetary operations
  - [x] 4.4 Standardize currency display formatting across sale dialog
  - [x] 4.5 Add validation for exchange values and sale amounts
  - [x] 4.6 Update mutation logic to use standardized calculation functions
  - [x] 4.7 Verify sale recording shows accurate amounts and calculations

- [ ] 5. Implement Real-time Data Consistency
  - [ ] 5.1 Write tests for concurrent sale recording scenarios
  - [ ] 5.2 Update TanStack Query invalidation patterns for calculation queries
  - [ ] 5.3 Implement optimistic updates with rollback for calculation operations
  - [ ] 5.4 Add debouncing for real-time Supabase subscription updates
  - [ ] 5.5 Ensure calculation consistency during concurrent operations
  - [ ] 5.6 Add calculation audit trail for debugging discrepancies
  - [ ] 5.7 Verify real-time updates maintain calculation accuracy