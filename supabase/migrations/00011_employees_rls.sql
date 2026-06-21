-- Fix RLS for employees table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can CRUD employees"
  ON employees FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
