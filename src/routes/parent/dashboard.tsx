import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/parent/dashboard")({
  component: ParentDashboard,
});

function ParentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUser(user);
      supabase.from("students").select("*").eq("parent_id", user.id).then(({ data }) => {
        if (data) {
          setStudents(data);
          const today = new Date().toISOString().split("T")[0];
          supabase.from("attendance").select("*").in("student_id", data.map((s: any) => s.id)).eq("date", today).then(({ data: att }) => {
            if (att) setTodayAttendance(att);
          });
        }
      });
    });
    supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(3).then(({ data }) => {
      if (data) setRecentAnnouncements(data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">My Children</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Present Today</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {todayAttendance.filter((a) => a.status === "present").length} / {students.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Announcements</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recentAnnouncements.length}</p>
          </CardContent>
        </Card>
      </div>
      {students.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Children Overview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {students.map((s) => {
              const att = todayAttendance.find((a) => a.student_id === s.id);
              return (
                <div key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{s.full_name}</p>
                    <p className="text-sm text-muted-foreground">{s.class}</p>
                  </div>
                  <div className="text-right">
                    {att ? (
                      <span className={`text-sm font-medium ${att.status === "present" ? "text-green-500" : att.status === "absent" ? "text-destructive" : "text-muted-foreground"}`}>
                        {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not marked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
      {recentAnnouncements.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Latest Announcements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentAnnouncements.map((a) => (
              <div key={a.id}>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
