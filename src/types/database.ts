export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "parent";
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type Student = {
  id: string;
  parent_id: string;
  full_name: string;
  class: string;
  date_of_birth: string;
  gender: string;
  photo_url: string | null;
  admission_date: string;
  status: "pending" | "active" | "rejected";
  created_at: string;
};

export type Attendance = {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent" | "leave";
  marked_by: string;
  created_at: string;
};

export type DailyRhythm = {
  id: string;
  activity_name: string;
  start_time: string;
  end_time: string;
  description: string;
  sort_order: number;
  created_at: string;
};

export type ReportCard = {
  id: string;
  student_id: string;
  academic_year: string;
  term: string;
  cognitive: Record<string, string>;
  language_literacy: Record<string, string>;
  mathematics: Record<string, string>;
  physical: Record<string, string>;
  social_emotional: Record<string, string>;
  aesthetic_cultural: Record<string, string>;
  teacher_remarks: string | null;
  generated_by: string;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: "news" | "event" | "holiday" | "update";
  created_by: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "approval" | "attendance" | "report" | "notice" | "event";
  read: boolean;
  created_at: string;
};

export type FileRecord = {
  id: string;
  name: string;
  url: string;
  type: "report_card" | "certificate" | "homework" | "activity" | "photo";
  student_id: string | null;
  uploaded_by: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile };
      students: { Row: Student };
      attendance: { Row: Attendance };
      daily_rhythm: { Row: DailyRhythm };
      report_cards: { Row: ReportCard };
      announcements: { Row: Announcement };
      notifications: { Row: Notification };
      files: { Row: FileRecord };
    };
  };
};
