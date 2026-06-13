import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { GradientText } from "@/components/site/Reveal";
import pandaMascot from "@/assets/panda-mascot.png";

export const Route = createFileRoute("/parent/dashboard")({
  component: ParentDashboard,
});

function StatCard({ label, value, icon, color, subtitle }: { label: string; value: string | number; icon: string; color: string; subtitle?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="h-full overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow duration-300 hover:shadow-lift">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-body text-sm font-semibold text-muted-foreground">{label}</CardTitle>
          <div className={`rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-2 ${color}`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl font-extrabold tracking-tight">{value}</p>
          {subtitle && <p className="mt-0.5 font-body text-xs text-muted-foreground">{subtitle}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

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

  const presentCount = todayAttendance.filter((a) => a.status === "present").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            <GradientText text="Parent Dashboard" />
          </h1>
          <p className="mt-1 font-body text-muted-foreground">
            {user ? `Welcome, ${user.user_metadata?.full_name || "Parent"}!` : "Welcome back!"}
          </p>
        </div>
        <motion.img
          src={pandaMascot}
          alt=""
          className="hidden w-16 opacity-40 md:block md:w-20"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="My Children"
          value={students.length}
          color="text-sky-500"
          icon="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
        />
        <StatCard
          label="Present Today"
          value={`${presentCount} / ${students.length}`}
          color="text-green-500"
          icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          subtitle={students.length > 0 ? `${Math.round((presentCount / students.length) * 100)}% attendance rate` : undefined}
        />
        <StatCard
          label="Recent Announcements"
          value={recentAnnouncements.length}
          color="text-accent"
          icon="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.502.502 0 0 1-.628-.113 18.368 18.368 0 0 1-2.383-3.66m0-3.75c.066.05.132.103.197.157M6.75 12a3.75 3.75 0 0 0 3.75 3.75h.75a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-.75-.75h-.75a3.75 3.75 0 0 0-3.75 3.75Zm4.5 0a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h.75a3.75 3.75 0 0 0 3.75-3.75v-1.5a3.75 3.75 0 0 0-3.75-3.75h-.75Z"
        />
      </div>

      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="rounded-2xl border border-primary/5 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-lg font-bold">Children Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((s, idx) => {
                const att = todayAttendance.find((a) => a.student_id === s.id);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-center justify-between rounded-xl border border-primary/5 bg-gradient-to-r from-primary/[0.02] to-transparent p-4 transition-colors hover:from-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-bamboo text-sm font-bold text-white shadow-soft">
                        {s.full_name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-display font-bold">{s.full_name}</p>
                        <p className="font-body text-xs text-muted-foreground">{s.class || "No class"}</p>
                      </div>
                    </div>
                    <div>
                      {att ? (
                        <span className={`rounded-full px-3 py-1 font-body text-xs font-bold ${
                          att.status === "present"
                            ? "bg-green-100 text-green-700"
                            : att.status === "absent"
                            ? "bg-red-100 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-3 py-1 font-body text-xs text-muted-foreground">
                          Not marked
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {recentAnnouncements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="rounded-2xl border border-primary/5 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-lg font-bold">Latest Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAnnouncements.map((a, idx) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="rounded-xl border border-primary/5 bg-gradient-to-r from-accent/[0.03] to-transparent p-4"
                >
                  <p className="font-display font-bold">{a.title}</p>
                  <p className="mt-0.5 font-body text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                  <p className="mt-1.5 font-body text-xs text-muted-foreground/60">
                    {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
