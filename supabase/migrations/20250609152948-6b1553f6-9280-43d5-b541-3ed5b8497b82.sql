
-- Add missing columns to the inventory table to match the form fields
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS color VARCHAR,
ADD COLUMN IF NOT EXISTS warranty_months INTEGER,
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS venue VARCHAR,
ADD COLUMN IF NOT EXISTS inward_by VARCHAR,
ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- Update the status column to use proper enum values if not already done
ALTER TABLE inventory 
ALTER COLUMN status SET DEFAULT 'In Stock';
