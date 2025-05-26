/*
  # Add Equipment Repairs

  1. New Tables
    - `repairs`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key to equipment)
      - `user_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `description` (text)
      - `repair_date` (date)
      - `completed_date` (date)
      - `cost` (numeric)
      - `parts_cost` (numeric)
      - `labor_cost` (numeric)
      - `status` (text)
      - `service_provider` (text)
      - `parts_replaced` (text[])
      - `diagnosis` (text)
      - `resolution` (text)
      - `odometer_reading` (numeric)
      - `warranty_claim` (boolean)
      - `warranty_details` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on repairs table
    - Add policies for CRUD operations
    - Foreign key constraints to equipment and profiles tables
*/

-- Create repairs table
CREATE TABLE IF NOT EXISTS repairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  repair_date date NOT NULL,
  completed_date date,
  cost numeric NOT NULL CHECK (cost >= 0),
  parts_cost numeric CHECK (parts_cost >= 0),
  labor_cost numeric CHECK (labor_cost >= 0),
  status text NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
  service_provider text,
  parts_replaced text[],
  diagnosis text,
  resolution text,
  odometer_reading numeric,
  warranty_claim boolean DEFAULT false,
  warranty_details text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own repairs"
  ON repairs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repairs"
  ON repairs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own repairs"
  ON repairs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own repairs"
  ON repairs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS repairs_equipment_id_idx ON repairs(equipment_id);
CREATE INDEX IF NOT EXISTS repairs_user_id_idx ON repairs(user_id);
CREATE INDEX IF NOT EXISTS repairs_status_idx ON repairs(status);
CREATE INDEX IF NOT EXISTS repairs_repair_date_idx ON repairs(repair_date);