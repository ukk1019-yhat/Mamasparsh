import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/parent/attendance")({
  component: ParentAttendance,
});

function ParentAttendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("students").select("id, full_name, class").eq("parent_id", user.id).then(({ data: students }) => {
        if (!students || students.length === 0) { setLoading(false); return; }
        supabase
          .from("attendance")
          .select("*")
          .in("student_id", students.map((s: any) => s.id))
          .order("date", { ascending: false })
          .limit(50)
          .then(({ data: att }) => {
            if (att) {
              const merged = att.map((a: any) => {
                const s = students.find((st: any) => st.id === a.student_id);
                return { ...a, student_name: s?.full_name, class: s?.class };
              });
              setRecords(merged);
            }
            setLoading(false);
          });
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Attendance Records</h1>
      <Card>
        <CardHeader><CardTitle>Recent History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
              ) : records.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">No attendance records found.</TableCell></TableRow>
              ) : records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{r.student_name}</TableCell>
                  <TableCell>{r.class}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "present" ? "default" : r.status === "absent" ? "destructive" : "secondary"}
                      className={r.status === "present" ? "bg-green-500" : ""}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
