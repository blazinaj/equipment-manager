/*
  # Fix profiles table RLS policies

  1. Security Changes
    - Enable RLS on profiles table (if not already enabled)
    - Add policy for authenticated users to insert their own profile
    - Add policy for authenticated users to read their own profile
    - Add policy for authenticated users to update their own profile

  Note: These policies ensure users can only manage their own profile data
*/

-- Enable RLS on profiles table (idempotent)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Attempt to drop existing policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        DROP POLICY "Users can insert own profile" ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read own profile') THEN
        DROP POLICY "Users can read own profile" ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        DROP POLICY "Users can update own profile" ON profiles;
    END IF;
END $$;

-- Create new policies
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);