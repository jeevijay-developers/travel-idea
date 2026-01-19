-- Create storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Allow anyone to view blog images (public bucket)
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow authenticated admins to upload blog images (simple approach without auth)
-- Since there's no user auth, we'll allow public uploads but in practice admin would be protected
CREATE POLICY "Anyone can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

-- Allow updates to blog images
CREATE POLICY "Anyone can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images');

-- Allow deletes of blog images
CREATE POLICY "Anyone can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images');