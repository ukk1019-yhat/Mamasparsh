-- Add class column to employees
ALTER TABLE employees ADD COLUMN class TEXT NOT NULL DEFAULT 'General';
