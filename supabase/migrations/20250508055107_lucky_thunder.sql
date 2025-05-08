/*
  # Add profiles insert policy

  1. Security Changes
    - Add RLS policy to allow authenticated users to insert their own profile
    - This policy ensures users can only create a profile for themselves
    - The policy uses auth.uid() to match the user's ID with the profile ID

  Note: The profiles table already has RLS enabled and policies for SELECT and UPDATE
*/

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);