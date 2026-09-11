# Shopkeeper Spark Control

Shopkeeper Spark Control is a browser-based mobile-phone shop dashboard for tracking inventory, sales, exchanges, invoices, suppliers, and transactions.

## Core features

- Dashboard summaries, recent sales, stock status, and sales charts.
- Inventory creation and editing with handset, IMEI, condition, pricing, supplier, and warranty details.
- Sale recording, customer records, payment transactions, and exchange-phone tracking.
- Invoice management and client-side PDF generation.
- Supabase-backed queries and mutations with React Query caching.
- Vitest coverage for calculation, dashboard, chart, and sale-dialog behavior.

## Technology stack

- React 18, TypeScript, and Vite 5
- React Router and TanStack React Query
- Supabase JavaScript client
- Tailwind CSS, shadcn/ui (Radix UI), and Lucide icons
- Recharts, jsPDF, Vitest, and Testing Library

## Prerequisites

- Node.js 20 or newer
- npm (a `package-lock.json` is included)
- Access to the Supabase project and schema expected by the generated client and migrations

## Local setup

```bash
git clone https://github.com/varunisrani/shopkeeper-spark-control.git
cd shopkeeper-spark-control
npm ci
npm run dev
```

Other verified scripts are:

```bash
npm run build
npm run preview
npm run lint
npm run test:run
```

Use `npm run test` for Vitest watch mode or `npm run test:ui` for its UI.

## Configuration

The current generated Supabase client does not read environment variables; its project URL and publishable client key are embedded in `src/integrations/supabase/client.ts`. No environment variable names are defined by this repository.

## Project structure

```text
src/pages/                  Dashboard, inventory, exchanges, invoices, and transactions
src/components/             Forms, charts, navigation, status displays, and UI primitives
src/hooks/                  Supabase-backed domain queries and mutations
src/integrations/supabase/  Generated database client and TypeScript types
src/lib/                    Calculations and shared utilities
src/utils/                  Formatting and PDF generation
supabase/migrations/        Database migration SQL
```

## Status and limitations

This is a client application coupled to an existing Supabase schema. A fresh clone can build without private configuration, but live data operations depend on the configured remote project, its availability, and its access policies. The repository does not include an authentication flow.