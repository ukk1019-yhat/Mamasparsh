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
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const PASSCODE = "360643";

type Employee = {
  id: string;
  full_name: string;
};

type EmpAttendance = {
  id: string;
  employee_id: string;
  date: string;
  status: "present" | "absent" | "leave";
};

export const Route = createFileRoute("/admin/employee-attendance")({
  component: EmployeeAttendance,
});

function EmployeeAttendance() {
  const [unlocked, setUnlocked] = useState(localStorage.getItem("emp_attendance_unlocked") === "true");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Map<string, string>>(new Map());
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  function handleUnlock() {
    if (passcode === PASSCODE) {
      setUnlocked(true);
      setError(false);
      localStorage.setItem("emp_attendance_unlocked", "true");
    } else {
      setError(true);
    }
  }

  function handleLock() {
    setUnlocked(false);
    localStorage.removeItem("emp_attendance_unlocked");
  }

  useEffect(() => {
    if (!unlocked) return;
    supabase.from("employees").select("*").order("full_name").then(({ data }) => {
      if (data) setEmployees(data as Employee[]);
      setLoading(false);
    });
  }, [unlocked]);

  useEffect(() => {
    if (employees.length === 0 || !unlocked) return;
    supabase.from("employee_attendance").select("*").eq("date", date).then(({ data }) => {
      if (data) {
        const map = new Map<string, string>();
        (data as EmpAttendance[]).forEach((a) => map.set(a.employee_id, a.status));
        setAttendance(map);
      }
    });
  }, [date, employees, unlocked]);

  async function markAll(status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const records = employees.map((e) => ({
      employee_id: e.id,
      date,
      status,
      marked_by: user.id,
    }));
    for (const r of records) {
      await supabase.from("employee_attendance").upsert(r, { onConflict: "employee_id, date" });
    }
    const map = new Map(attendance);
    employees.forEach((e) => map.set(e.id, status));
    setAttendance(map);
  }

  async function markSingle(employeeId: string, status: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("employee_attendance").upsert(
      { employee_id: employeeId, date, status, marked_by: user.id },
      { onConflict: "employee_id, date" }
    );
    const map = new Map(attendance);
    map.set(employeeId, status);
    setAttendance(map);
  }

  if (!unlocked) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center">
        <BambooBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-6 p-8"
        >
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold">
              <GradientText text="Staff Attendance" />
            </h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">Enter passcode to access</p>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              maxLength={6}
              placeholder="Enter 6-digit passcode"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              className="rounded-xl border-primary/20 text-center text-lg tracking-[0.5em]"
            />
            {error && <p className="font-body text-xs text-red-500 text-center">Incorrect passcode. Try again.</p>}
            <Button onClick={handleUnlock} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">
              Unlock
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="font-display text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Staff Attendance" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">Mark and track daily employee attendance.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLock} className="rounded-xl border-primary/20 font-body text-xs">
            Lock
          </Button>
        </div>
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
                    <TableHead className="font-body font-semibold">Employee</TableHead>
                    <TableHead className="font-body font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((e) => (
                    <TableRow key={e.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                      <TableCell className="font-body font-medium">{e.full_name}</TableCell>
                      <TableCell>
                        <Select value={attendance.get(e.id) || ""} onValueChange={(v) => markSingle(e.id, v)}>
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
                  {employees.length === 0 && (
                    <TableRow><TableCell colSpan={2} className="py-12 text-center"><p className="font-display text-muted-foreground">No employees found.</p></TableCell></TableRow>
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
