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
      - `image_url` (text)
      - `purchase_date` (date)
      - `purchase_price` (numeric)
      - `vin_number` (text, optional)
      - `license_plate` (text, optional)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on equipment table
    - Add policies for CRUD operations
*/

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE
  ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();