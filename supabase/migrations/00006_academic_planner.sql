-- Academic Planner for class-targeted updates from admin to parents
-- Run this in Supabase SQL Editor

CREATE TABLE academic_planner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_class TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_academic_planner_class ON academic_planner(target_class);
CREATE INDEX idx_academic_planner_created ON academic_planner(created_at DESC);

ALTER TABLE academic_planner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can CRUD academic planner"
  ON academic_planner FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Parents can read academic planner"
  ON academic_planner FOR SELECT
  USING (
    target_class IS NULL
    OR target_class IN (
      SELECT class FROM students WHERE parent_id = auth.uid()
    )
  );
