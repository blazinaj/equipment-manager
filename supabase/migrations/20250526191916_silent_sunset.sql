/*
  # Add Equipment Make, Model, and Model Number Fields

  1. Changes
    - Add make field to equipment table
    - Add model field to equipment table
    - Add model_number field to equipment table

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to equipment table
ALTER TABLE equipment 
ADD COLUMN make text,
ADD COLUMN model text,
ADD COLUMN model_number text;