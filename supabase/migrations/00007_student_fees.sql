-- Fee Portal: track fee payments per student per term
-- Run this in Supabase SQL Editor

CREATE TABLE student_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  term INT NOT NULL CHECK (term IN (1, 2, 3)),
  academic_year TEXT NOT NULL DEFAULT '2026-27',
  total_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  due_date DATE,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, term, academic_year)
);

CREATE INDEX idx_student_fees_student ON student_fees(student_id);

ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can CRUD student fees"
  ON student_fees FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Parents can read own students fees"
  ON student_fees FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE parent_id = auth.uid()));
