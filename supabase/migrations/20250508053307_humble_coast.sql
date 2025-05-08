/*
  # Fix profiles table RLS policies for user signup

  1. Security Changes
    - Add policy for users to insert their own profile during signup
    - Keep existing policies for authenticated users

  Note: This migration adds a specific policy to allow profile creation during signup
  while maintaining existing security policies.
*/

-- Drop the existing insert policy if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert own profile'
    ) THEN
        DROP POLICY "Users can insert own profile" ON profiles;
    END IF;
END $$;

-- Create new insert policy that allows profile creation during signup
CREATE POLICY "Enable insert for signing up users"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);