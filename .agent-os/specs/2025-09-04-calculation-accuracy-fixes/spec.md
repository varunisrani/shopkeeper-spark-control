# Spec Requirements Document

> Spec: Calculation Accuracy Fixes
> Created: 2025-09-04
> Status: Planning

## Overview

Fix critical calculation inconsistencies and accuracy issues in ShopKeeper Spark's financial analytics that are causing profit calculation mismatches between dashboard and sales chart, revenue vs sales data inconsistencies, and float precision problems affecting business decision-making.

## User Stories

### Shop Owner Financial Accuracy
As a mobile shop owner, I want accurate profit calculations across all dashboard views, so that I can make informed business decisions and trust the financial data displayed in the system.

The shop owner needs consistent profit calculations whether viewing the main dashboard summary or detailed sales chart analytics. Currently, different calculation methods between dashboard (actual purchase vs sale price) and sales chart (arbitrary 30% assumption) create confusion and mistrust in the system's financial reporting.

### Store Manager Operational Reporting  
As a store manager, I want reliable revenue and sales metrics, so that I can accurately track daily performance and report to stakeholders.

The manager needs to reconcile revenue totals from the sales table with profit calculations from the inventory table, ensuring all financial data sources provide consistent information for operational reporting and performance tracking.

### Accountant Data Integrity
As an accountant handling the books, I want precise currency calculations with proper decimal handling, so that financial records are accurate and compliant.

Currency calculations must handle decimal precision correctly, avoid floating-point rounding errors, and maintain consistency across all financial operations including sales, exchanges, and profit margin calculations.

## Spec Scope

1. **Profit Calculation Standardization** - Implement consistent profit calculation methodology across dashboard stats and sales chart analytics
2. **Data Source Reconciliation** - Ensure revenue and profit calculations use consistent data sources and aggregation methods  
3. **Currency Precision Enhancement** - Implement proper decimal handling and rounding for all monetary calculations
4. **Real-time Data Consistency** - Maintain calculation accuracy during Supabase real-time updates
5. **Financial Calculation Utilities** - Create reusable utility functions for all monetary operations

## Out of Scope

- Changes to database schema or migration of historical data
- Addition of new financial features or reporting capabilities
- Integration with external accounting software
- Changes to invoice generation or PDF export functionality

## Expected Deliverable

1. Dashboard stats and sales chart show identical profit calculations for the same time periods
2. All monetary values display with consistent precision and proper rounding across the application
3. Revenue totals and profit calculations can be manually verified against database records without discrepancies

## Spec Documentation

- Tasks: @.agent-os/specs/2025-09-04-calculation-accuracy-fixes/tasks.md
- Technical Specification: @.agent-os/specs/2025-09-04-calculation-accuracy-fixes/sub-specs/technical-spec.md