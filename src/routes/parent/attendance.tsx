import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
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
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Attendance Records" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">View your child&apos;s attendance history.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-emerald-400/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Recent History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Date</TableHead>
                  <TableHead className="font-body font-semibold">Student</TableHead>
                  <TableHead className="font-body font-semibold">Class</TableHead>
                  <TableHead className="font-body font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="py-12 text-center"><p className="font-display text-muted-foreground">Loading attendance...</p></TableCell></TableRow>
                ) : records.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="py-12 text-center"><p className="font-display text-muted-foreground">No attendance records found.</p></TableCell></TableRow>
                ) : records.map((r) => (
                  <TableRow key={r.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="font-body">{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                    <TableCell className="font-body font-medium">{r.student_name}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{r.class}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "present" ? "default" : r.status === "absent" ? "destructive" : "secondary"}
                        className={`rounded-full font-body text-xs ${r.status === "present" ? "bg-emerald-500" : r.status === "absent" ? "" : ""}`}>
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
      </motion.div>
    </div>
  );
}
