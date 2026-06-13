import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { AttendanceChart } from "@/components/management/AttendanceChart";
import { ClassDistributionChart } from "@/components/management/ClassDistributionChart";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, activeStudents: 0, totalParents: 0, pendingParents: 0, todayPresent: 0, totalAttendance: 0 });

  useEffect(() => {
    async function load() {
      const [{ count: totalStudents }, { count: activeStudents }, { count: totalParents }, { count: pendingParents }] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "parent"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "parent").eq("status", "pending"),
      ]);
      const today = new Date().toISOString().split("T")[0];
      const { count: todayPresent } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("date", today)
        .eq("status", "present");
      const { count: totalAttendance } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true });
      setStats({ totalStudents: totalStudents!, activeStudents: activeStudents!, totalParents: totalParents!, pendingParents: pendingParents!, todayPresent: todayPresent!, totalAttendance: totalAttendance! });
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.totalStudents}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Students</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.activeStudents}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Parents</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.totalParents}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Approvals</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-amber-500">{stats.pendingParents}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Present Today</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-500">{stats.todayPresent}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Attendance</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.totalAttendance}</p></CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart />
        <ClassDistributionChart />
      </div>
    </div>
  );
}
