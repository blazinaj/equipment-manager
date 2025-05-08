/*
  # Fix Profiles RLS Policy

  1. Changes
    - Add RLS policy to allow authenticated users to insert their own profile
    - This fixes the 403 error when creating new profiles

  2. Security
    - Policy ensures users can only create profiles with their own ID
    - Maintains existing policies for SELECT and UPDATE
*/

-- Add policy to allow authenticated users to insert their own profile
CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);