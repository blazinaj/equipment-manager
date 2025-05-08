/*
  # Equipment Management Schema

  1. New Tables
    - `equipment`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `name` (text)
      - `type` (text)
      - `year` (integer)
      - `status` (text)
      - `image_url` (text, nullable)
      - `purchase_date` (date)
      - `purchase_price` (numeric)
      - `vin_number` (text, nullable)
      - `license_plate` (text, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on equipment table
    - Add policies for CRUD operations
    - Foreign key constraint to profiles table

  3. Triggers
    - Add updated_at trigger
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  type text NOT NULL,
  year integer NOT NULL,
  status text NOT NULL CHECK (status IN ('Good', 'Fair', 'Poor')),
  image_url text,
  purchase_date date NOT NULL,
  purchase_price numeric NOT NULL CHECK (purchase_price >= 0),
  vin_number text,
  license_plate text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can view own equipment') THEN
        DROP POLICY "Users can view own equipment" ON equipment;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can insert own equipment') THEN
        DROP POLICY "Users can insert own equipment" ON equipment;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can update own equipment') THEN
        DROP POLICY "Users can update own equipment" ON equipment;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can delete own equipment') THEN
        DROP POLICY "Users can delete own equipment" ON equipment;
    END IF;
END $$;

-- Create RLS policies
CREATE POLICY "Users can view own equipment"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment"
  ON equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment"
  ON equipment
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment"
  ON equipment
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_equipment_updated_at ON equipment;
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS equipment_user_id_idx ON equipment(user_id);
CREATE INDEX IF NOT EXISTS equipment_type_idx ON equipment(type);
CREATE INDEX IF NOT EXISTS equipment_status_idx ON equipment(status);