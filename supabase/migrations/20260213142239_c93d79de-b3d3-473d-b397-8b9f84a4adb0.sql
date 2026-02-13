
-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read article images
CREATE POLICY "Article images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'articles');

-- Allow authenticated users to upload article images
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'articles' AND auth.role() = 'authenticated');

-- Allow users to delete their own article images
CREATE POLICY "Users can delete their own article images"
ON storage.objects FOR DELETE
USING (bucket_id = 'articles' AND auth.role() = 'authenticated');
