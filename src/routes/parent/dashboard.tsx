import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { GradientText } from "@/components/site/Reveal";
import pandaMascot from "@/assets/panda-mascot.png";
import pandaPlays from "@/assets/panda-plays.png";
import pandaGrows from "@/assets/panda-grows.png";

export const Route = createFileRoute("/parent/dashboard")({
  component: ParentDashboard,
});

function BambooStalk({ left, height, delay, tilt }: { left: string; height: string; delay: number; tilt: string }) {
  return (
    <motion.div
      className={`absolute bottom-0 ${height} w-[5px] md:w-[6px] ${tilt}`}
      style={{ left }}
      animate={{ rotate: [0, 1.5, -1.5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg viewBox="0 0 8 200" className="h-full w-full" fill="none">
        <rect x="2" width="4" height="200" rx="2" className="fill-emerald-700/20" />
        {[35, 70, 105, 140, 175].map((y) => (
          <g key={y}>
            <rect x="0" y={y-1} width="8" height="3" rx="1" className="fill-emerald-600/25" />
            <path d={`M8 ${y+1} L15 ${y-6} L14 ${y-1} Z`} className="fill-emerald-500/20" />
            <path d={`M0 ${y+1} L-7 ${y-5} L-6 ${y-1} Z`} className="fill-emerald-500/15" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

function StatCard({ label, value, icon, gradient, border, subtitle, index }: {
  label: string; value: string | number; icon: string; gradient: string; border: string; subtitle?: string; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <Card className={`h-full overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${gradient} shadow-soft transition-all duration-300 hover:shadow-lift`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-body text-sm font-bold uppercase tracking-wider text-muted-foreground/70">{label}</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/60 shadow-sm backdrop-blur">
            <svg className="h-4 w-4 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl font-extrabold tracking-tight">{value}</p>
          {subtitle && <p className="mt-0.5 font-body text-xs text-muted-foreground/70">{subtitle}</p>}
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
    <div className="relative space-y-8">
      {/* Bamboo decorations */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <BambooStalk left="1%" height="h-28 md:h-40" delay={0} tilt="-rotate-2" />
        <BambooStalk left="4%" height="h-20 md:h-28" delay={0.7} tilt="rotate-1" />
        <BambooStalk left="96%" height="h-32 md:h-44" delay={0.4} tilt="rotate-2" />
        <BambooStalk left="99%" height="h-20 md:h-32" delay={1} tilt="-rotate-1" />

        <motion.img
          src={pandaPlays}
          alt=""
          className="absolute -left-2 top-[12%] w-12 opacity-10 md:w-16 md:opacity-15"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={pandaGrows}
          alt=""
          className="absolute -right-2 bottom-[25%] w-10 opacity-10 md:w-14 md:opacity-12"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5 p-6 md:p-8"
      >
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Parent Dashboard" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">
              {user ? `Nammo, ${user.user_metadata?.full_name || "Parent"}!` : "Welcome back!"} Stay connected with your little one&apos;s journey.
            </p>
          </div>
          <motion.img
            src={pandaMascot}
            alt=""
            className="hidden w-16 opacity-60 md:block md:w-20"
            animate={{ y: [0, -8, 0], rotate: [0, -3, 0, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="My Children"
          value={students.length}
          index={0}
          gradient="from-sky-400/20 to-sky-400/5"
          border="border-sky-200/30"
          icon="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
        />
        <StatCard
          label="Present Today"
          value={`${presentCount} / ${students.length}`}
          index={1}
          gradient="from-emerald-400/20 to-emerald-400/5"
          border="border-emerald-200/30"
          icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          subtitle={students.length > 0 ? `${Math.round((presentCount / students.length) * 100)}% attendance rate` : undefined}
        />
        <StatCard
          label="Recent Announcements"
          value={recentAnnouncements.length}
          index={2}
          gradient="from-amber-400/20 to-amber-400/5"
          border="border-amber-200/30"
          icon="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.502.502 0 0 1-.628-.113 18.368 18.368 0 0 1-2.383-3.66m0-3.75c.066.05.132.103.197.157M6.75 12a3.75 3.75 0 0 0 3.75 3.75h.75a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-.75-.75h-.75a3.75 3.75 0 0 0-3.75 3.75Zm4.5 0a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h.75a3.75 3.75 0 0 0 3.75-3.75v-1.5a3.75 3.75 0 0 0-3.75-3.75h-.75Z"
        />
      </div>

      {/* Children Overview */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
              <CardTitle className="font-display text-lg font-bold">
                <span className="bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">👶 Children Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((s, idx) => {
                const att = todayAttendance.find((a) => a.student_id === s.id);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + 0.08 * idx }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-xl border border-primary/5 bg-gradient-to-r from-primary/[0.02] to-transparent p-4 transition-colors hover:from-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-500 text-base font-bold text-white shadow-soft">
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
                            ? "bg-emerald-100 text-emerald-700"
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

      {/* Announcements */}
      {recentAnnouncements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-transparent">
              <CardTitle className="font-display text-lg font-bold">
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">📢 Latest Announcements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAnnouncements.map((a, idx) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + 0.05 * idx }}
                  className="rounded-xl border border-primary/5 bg-gradient-to-r from-accent/[0.03] to-transparent p-4 transition-colors hover:from-accent/10"
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
