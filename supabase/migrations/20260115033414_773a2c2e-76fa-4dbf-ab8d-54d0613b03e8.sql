-- Create storage bucket for team member images
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-images', 'team-images', true);

-- Allow anyone to view team images (public bucket)
CREATE POLICY "Anyone can view team images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team-images');

-- Allow admins to upload team images
CREATE POLICY "Admins can upload team images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'team-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update team images
CREATE POLICY "Admins can update team images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'team-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete team images
CREATE POLICY "Admins can delete team images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'team-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);