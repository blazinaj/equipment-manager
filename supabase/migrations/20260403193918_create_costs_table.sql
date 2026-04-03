/*
  # Create Costs Table

  1. New Tables
    - `costs`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key to equipment)
      - `user_id` (uuid, foreign key to profiles)
      - `category` (text: maintenance, repair, upgrade, fuel, other)
      - `amount` (numeric)
      - `date` (date)
      - `description` (text)
      - `receipt_url` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on costs table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  category text NOT NULL CHECK (category IN ('maintenance', 'repair', 'upgrade', 'fuel', 'other')),
  amount numeric NOT NULL CHECK (amount >= 0),
  date date NOT NULL,
  description text NOT NULL,
  receipt_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own costs"
  ON costs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own costs"
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

-- Create trigger
CREATE TRIGGER update_costs_updated_at
  BEFORE UPDATE
  ON costs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS costs_equipment_id_idx ON costs(equipment_id);
CREATE INDEX IF NOT EXISTS costs_user_id_idx ON costs(user_id);
CREATE INDEX IF NOT EXISTS costs_category_idx ON costs(category);
CREATE INDEX IF NOT EXISTS costs_date_idx ON costs(date);