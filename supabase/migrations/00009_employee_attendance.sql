-- Employee attendance tracking (passcode-protected)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO employees (full_name) VALUES
  ('Sudha Manjusha'),
  ('Likitha'),
  ('Prashanthi'),
  ('Rama'),
  ('Lakshmamma'),
  ('Chinnari'),
  ('Tejaswini');

CREATE TABLE employee_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
  marked_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employee_id, date)
);

CREATE INDEX idx_emp_attendance_employee ON employee_attendance(employee_id);
CREATE INDEX idx_emp_attendance_date ON employee_attendance(date);

ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can CRUD employee attendance"
  ON employee_attendance FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
