/*
  # Create storage bucket for equipment images

  1. Storage Setup
    - Create 'equipment-images' bucket for storing equipment photos
    - Enable public access to images
  
  2. Security
    - Add policy for authenticated users to upload images
    - Add policy for public access to view images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('equipment-images', 'equipment-images', true);

-- Allow authenticated users to upload files to the bucket
CREATE POLICY "Users can upload equipment images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'equipment-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own equipment images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'equipment-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own equipment images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'equipment-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Allow public access to view files
CREATE POLICY "Public can view equipment images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'equipment-images');