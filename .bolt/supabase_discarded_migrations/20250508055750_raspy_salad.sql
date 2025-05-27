/*
  # Equipment Manager Database Schema

  1. New Tables
    - maintenance_records
      - id (uuid, primary key)
      - equipment_id (uuid, references equipment)
      - user_id (uuid, references profiles)
      - title (text)
      - description (text)
      - status (text: upcoming, overdue, completed)
      - due_date (date)
      - completed_date (date, nullable)
      - cost (numeric)
      - odometer_reading (numeric, nullable)
      - service_provider (text, nullable)
      - notes (text, nullable)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - costs
      - id (uuid, primary key)
      - equipment_id (uuid, references equipment)
      - user_id (uuid, references profiles)
      - category (text: maintenance, repair, upgrade, fuel, other)
      - amount (numeric)
      - date (date)
      - description (text)
      - receipt_url (text, nullable)
      - notes (text, nullable)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create maintenance_records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  status text NOT NULL CHECK (status IN ('upcoming', 'overdue', 'completed')),
  due_date date NOT NULL,
  completed_date date,
  cost numeric NOT NULL,
  odometer_reading numeric,
  service_provider text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create costs table
CREATE TABLE IF NOT EXISTS costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  category text NOT NULL CHECK (category IN ('maintenance', 'repair', 'upgrade', 'fuel', 'other')),
  amount numeric NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  receipt_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

-- Maintenance Records Policies
CREATE POLICY "Users can view own maintenance records"
  ON maintenance_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own maintenance records"
  ON maintenance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own maintenance records"
  ON maintenance_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own maintenance records"
  ON maintenance_records
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Costs Policies
CREATE POLICY "Users can view own costs"
  ON costs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own costs"
  ON costs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own costs"
  ON costs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own costs"
  ON costs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_maintenance_records_updated_at
  BEFORE UPDATE
  ON maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_costs_updated_at
  BEFORE UPDATE
  ON costs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();