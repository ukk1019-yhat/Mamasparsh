import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { AttendanceChart } from "@/components/management/AttendanceChart";
import { ClassDistributionChart } from "@/components/management/ClassDistributionChart";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import pandaMascot from "@/assets/panda-mascot.png";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

const statCards = [
  {
    key: "totalStudents", label: "Total Students", value: 0,
    gradient: "from-sky-400/20 to-sky-400/5",
    border: "border-sky-200/30",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  },
  {
    key: "activeStudents", label: "Active Students", value: 0,
    gradient: "from-green-400/20 to-green-400/5",
    border: "border-green-200/30",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    key: "totalParents", label: "Parents", value: 0,
    gradient: "from-secondary/20 to-secondary/5",
    border: "border-purple-200/30",
    icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  },
  {
    key: "pendingParents", label: "Pending Approvals", value: 0,
    gradient: "from-amber-400/20 to-amber-400/5",
    border: "border-amber-200/30",
    icon: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z",
  },
  {
    key: "todayPresent", label: "Present Today", value: 0,
    gradient: "from-emerald-400/20 to-emerald-400/5",
    border: "border-emerald-200/30",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    key: "totalAttendance", label: "Total Attendance", value: 0,
    gradient: "from-teal-400/20 to-teal-400/5",
    border: "border-teal-200/30",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  },
];

function StatCard({ label, value, icon, gradient, border, index }: { label: string; value: number; icon: string; gradient: string; border: string; index: number }) {
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
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, activeStudents: 0, totalParents: 0, pendingParents: 0, todayPresent: 0, totalAttendance: 0 });
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) setProfileName(user.user_metadata.full_name);

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

  const statValues: Record<string, number> = {
    totalStudents: stats.totalStudents,
    activeStudents: stats.activeStudents,
    totalParents: stats.totalParents,
    pendingParents: stats.pendingParents,
    todayPresent: stats.todayPresent,
    totalAttendance: stats.totalAttendance,
  };

  return (
    <div className="relative space-y-8">
      <BambooBackground />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-6 md:p-8"
      >
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Admin Dashboard" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">
              {profileName ? `Welcome back, ${profileName}!` : "Welcome back!"} Here&apos;s your preschool at a glance.
            </p>
          </div>
          <motion.img
            src={pandaMascot}
            alt=""
            className="hidden w-20 opacity-60 md:block md:w-24"
            animate={{ y: [0, -8, 0], rotate: [0, -3, 0, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <StatCard
            key={card.key}
            label={card.label}
            value={statValues[card.key]}
            icon={card.icon}
            gradient={card.gradient}
            border={card.border}
            index={idx}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AttendanceChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ClassDistributionChart />
        </motion.div>
      </div>
    </div>
  );
}
