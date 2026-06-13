import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import type { Student, Attendance } from "@/types/database";

export const Route = createFileRoute("/admin/attendance")({
  component: AdminAttendance,
});

function AdminAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, string>>(new Map());
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("students").select("*").eq("status", "active").then(({ data }) => {
      if (data) setStudents(data as Student[]);
    });
  }, []);

  useEffect(() => {
    if (students.length === 0) return;
    supabase.from("attendance").select("*").eq("date", date).then(({ data }) => {
      if (data) {
        const map = new Map<string, string>();
        (data as Attendance[]).forEach((a) => map.set(a.student_id, a.status));
        setAttendance(map);
      }
    });
  }, [date, students]);

  async function markAll(status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const records = students.map((s) => ({
      student_id: s.id,
      date,
      status,
      marked_by: user.id,
    }));
    for (const r of records) {
      await supabase.from("attendance").upsert(r, { onConflict: "student_id, date" });
    }
    const map = new Map(attendance);
    students.forEach((s) => map.set(s.id, status));
    setAttendance(map);
  }

  async function markSingle(studentId: string, status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("attendance").upsert(
      { student_id: studentId, date, status, marked_by: user.id },
      { onConflict: "student_id, date" }
    );
    const map = new Map(attendance);
    map.set(studentId, status);
    setAttendance(map);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
      <div className="flex items-center gap-4">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-background" />
        <Button size="sm" variant="outline" onClick={() => markAll("present")}>Mark All Present</Button>
        <Button size="sm" variant="outline" onClick={() => markAll("absent")}>Mark All Absent</Button>
        <Button size="sm" variant="outline" onClick={() => markAll("leave")}>Mark All Leave</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Attendance for {date}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.full_name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>
                    <Select
                      value={attendance.get(s.id) || ""}
                      onValueChange={(v) => markSingle(s.id, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">
                          <Badge variant="default" className="bg-green-500">Present</Badge>
                        </SelectItem>
                        <SelectItem value="absent">
                          <Badge variant="destructive">Absent</Badge>
                        </SelectItem>
                        <SelectItem value="leave">
                          <Badge variant="secondary">Leave</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center">No active students.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
