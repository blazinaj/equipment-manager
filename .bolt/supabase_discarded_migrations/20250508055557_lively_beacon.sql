/*
  # Fix Profile Table Policies

  1. Changes
    - Drop all existing profile policies
    - Create new consolidated policies for profiles table
    - Enable public insert for signup
    - Enable authenticated user access to own profile

  2. Security
    - Maintains row-level security
    - Allows profile creation during signup
    - Restricts profile access to owners
*/

-- First, drop all existing policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') THEN
    DROP POLICY IF EXISTS "Enable insert for signing up users" ON profiles;
    DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new consolidated policies

-- Allow public insert during signup
CREATE POLICY "Enable insert for signing up users"
ON profiles
FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);