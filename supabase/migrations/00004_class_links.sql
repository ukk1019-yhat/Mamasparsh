-- Class Resource Links (Google Drive etc.)
-- Run this in Supabase SQL Editor

CREATE TABLE class_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE class_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage class links"
  ON class_links FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Parents can read class links"
  ON class_links FOR SELECT
  USING (true);
