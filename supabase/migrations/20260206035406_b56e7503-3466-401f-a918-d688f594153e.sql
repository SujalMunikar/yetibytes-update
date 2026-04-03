-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Allow anyone to view blog images (public bucket)
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow authenticated admins to upload blog images
CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to update blog images
CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to delete blog images
CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);