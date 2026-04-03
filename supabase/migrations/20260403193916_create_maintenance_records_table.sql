/*
  # Create Maintenance Records Table

  1. New Tables
    - `maintenance_records`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key to equipment)
      - `user_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `description` (text)
      - `status` (text: upcoming, overdue, completed)
      - `due_date` (date)
      - `completed_date` (date)
      - `cost` (numeric)
      - `odometer_reading` (numeric)
      - `service_provider` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on maintenance_records table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  status text NOT NULL CHECK (status IN ('upcoming', 'overdue', 'completed')) DEFAULT 'upcoming',
  due_date date NOT NULL,
  completed_date date,
  cost numeric DEFAULT 0 CHECK (cost >= 0),
  odometer_reading numeric,
  service_provider text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own maintenance records"
  ON maintenance_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own maintenance records"
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

-- Create trigger
CREATE TRIGGER update_maintenance_records_updated_at
  BEFORE UPDATE
  ON maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS maintenance_records_equipment_id_idx ON maintenance_records(equipment_id);
CREATE INDEX IF NOT EXISTS maintenance_records_user_id_idx ON maintenance_records(user_id);
CREATE INDEX IF NOT EXISTS maintenance_records_status_idx ON maintenance_records(status);
CREATE INDEX IF NOT EXISTS maintenance_records_due_date_idx ON maintenance_records(due_date);