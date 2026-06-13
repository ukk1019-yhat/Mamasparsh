-- Fix recursive RLS policies that cause 500 errors
-- Old pattern: auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
--   This queries profiles table recursively, causing infinite loop
-- New pattern: (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
--   This reads role directly from JWT, no recursion

-- PROFILES
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- STUDENTS
DROP POLICY IF EXISTS "Admins can CRUD all students" ON students;
CREATE POLICY "Admins can CRUD all students"
  ON students FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- ATTENDANCE
DROP POLICY IF EXISTS "Admins can CRUD attendance" ON attendance;
CREATE POLICY "Admins can CRUD attendance"
  ON attendance FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- DAILY RHYTHM
DROP POLICY IF EXISTS "Admins can CRUD daily rhythm" ON daily_rhythm;
CREATE POLICY "Admins can CRUD daily rhythm"
  ON daily_rhythm FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- REPORT CARDS
DROP POLICY IF EXISTS "Admins can CRUD report cards" ON report_cards;
CREATE POLICY "Admins can CRUD report cards"
  ON report_cards FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- ANNOUNCEMENTS
DROP POLICY IF EXISTS "Admins can CRUD announcements" ON announcements;
CREATE POLICY "Admins can CRUD announcements"
  ON announcements FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- FILES
DROP POLICY IF EXISTS "Admins can CRUD files" ON files;
CREATE POLICY "Admins can CRUD files"
  ON files FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Missing policies: profiles UPDATE + notifications ALL (for admin approval flow)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can manage notifications" ON notifications;
CREATE POLICY "Admins can manage notifications"
  ON notifications FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
