-- Add image_url and target_class to announcements
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS target_class TEXT;

-- Also create a storage bucket for announcement images (run in Supabase Dashboard > Storage):
-- CREATE BUCKET announcement-images WITH (public = true);
