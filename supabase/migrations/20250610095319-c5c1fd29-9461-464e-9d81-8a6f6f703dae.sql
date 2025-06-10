
-- Add missing columns to inventory table
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS sale_date date,
ADD COLUMN IF NOT EXISTS customer_name character varying,
ADD COLUMN IF NOT EXISTS customer_phone character varying,
ADD COLUMN IF NOT EXISTS customer_address text,
ADD COLUMN IF NOT EXISTS payment_method character varying,
ADD COLUMN IF NOT EXISTS exchange_old_phone boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS additional_sale_notes text;

-- Add missing columns to sales table  
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS customer_address text,
ADD COLUMN IF NOT EXISTS exchange_old_phone boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS additional_sale_notes text,
ADD COLUMN IF NOT EXISTS imei_serial character varying;

-- Update customers table to include address if not exists
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS address_field text;
