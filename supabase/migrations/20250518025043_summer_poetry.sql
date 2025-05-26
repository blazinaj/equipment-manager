/*
  # Add Equipment Upgrades

  1. New Tables
    - `upgrades`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, foreign key to equipment)
      - `user_id` (uuid, foreign key to profiles)
      - `name` (text)
      - `manufacturer` (text)
      - `description` (text)
      - `category` (text)
      - `status` (text)
      - `install_date` (date)
      - `cost` (numeric)
      - `value_increase` (numeric)
      - `image_url` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on upgrades table
    - Add policies for CRUD operations
    - Foreign key constraints to equipment and profiles tables

  3. Storage
    - Create storage bucket for upgrade images
*/

-- Create upgrades table
CREATE TABLE IF NOT EXISTS upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  manufacturer text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('Performance', 'Appearance', 'Utility', 'Safety', 'Other')),
  status text NOT NULL CHECK (status IN ('Installed', 'Planned', 'Removed')),
  install_date date,
  cost numeric NOT NULL CHECK (cost >= 0),
  value_increase numeric DEFAULT 0 CHECK (value_increase >= 0),
  image_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE upgrades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own upgrades"
  ON upgrades
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own upgrades"
  ON upgrades
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own upgrades"
  ON upgrades
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own upgrades"
  ON upgrades
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS upgrades_equipment_id_idx ON upgrades(equipment_id);
CREATE INDEX IF NOT EXISTS upgrades_user_id_idx ON upgrades(user_id);
CREATE INDEX IF NOT EXISTS upgrades_category_idx ON upgrades(category);
CREATE INDEX IF NOT EXISTS upgrades_status_idx ON upgrades(status);

-- Create storage bucket for upgrade images
INSERT INTO storage.buckets (id, name, public)
VALUES ('upgrade-images', 'upgrade-images', true);

-- Storage policies
CREATE POLICY "Users can upload upgrade images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'upgrade-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can update their upgrade images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'upgrade-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can delete their upgrade images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'upgrade-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Public can view upgrade images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'upgrade-images');