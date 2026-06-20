-- Move total_fee to students table (one annual fee per student)
ALTER TABLE students ADD COLUMN total_fee DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE student_fees DROP COLUMN total_fee;
