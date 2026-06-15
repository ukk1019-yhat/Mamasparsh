import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
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
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Attendance" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Mark and track daily student attendance.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl border border-primary/10 bg-card px-4 py-2 shadow-soft">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent font-body text-sm outline-none" />
        </div>
        <Button size="sm" onClick={() => markAll("present")} className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 font-display text-xs font-bold text-white shadow-soft">Mark All Present</Button>
        <Button size="sm" onClick={() => markAll("absent")} className="rounded-xl bg-gradient-to-r from-red-500 to-red-400 font-display text-xs font-bold text-white shadow-soft">Mark All Absent</Button>
        <Button size="sm" onClick={() => markAll("leave")} className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 font-display text-xs font-bold text-white shadow-soft">Mark All Leave</Button>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-emerald-400/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Attendance for {date}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Student</TableHead>
                  <TableHead className="font-body font-semibold">Class</TableHead>
                  <TableHead className="font-body font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="font-body font-medium">{s.full_name}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{s.class}</TableCell>
                    <TableCell>
                      <Select
                        value={attendance.get(s.id) || ""}
                        onValueChange={(v) => markSingle(s.id, v)}
                      >
                        <SelectTrigger className="w-36 rounded-xl border-primary/20">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Present</span>
                          </SelectItem>
                          <SelectItem value="absent">
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /> Absent</span>
                          </SelectItem>
                          <SelectItem value="leave">
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Leave</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="py-12 text-center"><p className="font-display text-muted-foreground">No active students.</p></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
