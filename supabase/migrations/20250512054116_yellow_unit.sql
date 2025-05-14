/*
  # Update Equipment Schema Fields

  1. Changes
    - Make year field optional
    - Make purchase_date field optional
    - Make purchase_price field optional

  2. Security
    - Maintain existing RLS policies
    - Keep data integrity with CHECK constraints
*/

-- Modify year column to be nullable
ALTER TABLE equipment ALTER COLUMN year DROP NOT NULL;

-- Modify purchase_date column to be nullable
ALTER TABLE equipment ALTER COLUMN purchase_date DROP NOT NULL;

-- Modify purchase_price column to be nullable
ALTER TABLE equipment ALTER COLUMN purchase_price DROP NOT NULL;

-- Update purchase_price check constraint to allow null
ALTER TABLE equipment DROP CONSTRAINT IF EXISTS equipment_purchase_price_check;
ALTER TABLE equipment ADD CONSTRAINT equipment_purchase_price_check 
  CHECK (purchase_price IS NULL OR purchase_price >= 0);