-- Daily Performance Ratings for Students
-- Run this in Supabase SQL Editor

CREATE TABLE daily_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  cognitive TEXT,
  language_literacy TEXT,
  mathematics TEXT,
  physical TEXT,
  social_emotional TEXT,
  aesthetic_cultural TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, date)
);

CREATE INDEX idx_daily_performance_student ON daily_performance(student_id);
CREATE INDEX idx_daily_performance_date ON daily_performance(date);

ALTER TABLE daily_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can CRUD daily performance"
  ON daily_performance FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Parents can read own students daily performance"
  ON daily_performance FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE parent_id = auth.uid()));
