/*
  # Equipment Management Schema

  1. New Tables
    - `equipment`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `name` (text)
      - `type` (text)
      - `year` (integer)
      - `status` (text, enum: Good, Fair, Poor)
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
    - Add updated_at trigger
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can view own equipment') THEN
        DROP POLICY "Users can view own equipment" ON equipment;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can create own equipment') THEN
        DROP POLICY "Users can create own equipment" ON equipment;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can update own equipment') THEN
        DROP POLICY "Users can update own equipment" ON equipment;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipment' AND policyname = 'Users can delete own equipment') THEN
        DROP POLICY "Users can delete own equipment" ON equipment;
    END IF;
END $$;

-- Create equipment table if it doesn't exist
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  year integer NOT NULL,
  status text NOT NULL CHECK (status IN ('Good', 'Fair', 'Poor')),
  image_url text,
  purchase_date date NOT NULL,
  purchase_price numeric NOT NULL,
  vin_number text,
  license_plate text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own equipment"
  ON equipment
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own equipment"
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

-- Create updated_at trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    END IF;
END $$;

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_equipment_updated_at') THEN
        CREATE TRIGGER update_equipment_updated_at
            BEFORE UPDATE
            ON equipment
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;