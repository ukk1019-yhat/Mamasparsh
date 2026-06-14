import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { DailyRhythm } from "@/types/database";

export const Route = createFileRoute("/parent/daily-rhythm")({
  component: ParentDailyRhythm,
});

function ParentDailyRhythm() {
  const [activities, setActivities] = useState<DailyRhythm[]>([]);

  useEffect(() => {
    supabase.from("daily_rhythm").select("*").order("sort_order").then(({ data }) => {
      if (data) setActivities(data as DailyRhythm[]);
    });
  }, []);

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Daily Rhythm" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Your child&apos;s daily preschool schedule.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Time</TableHead>
                  <TableHead className="font-body font-semibold">Activity</TableHead>
                  <TableHead className="font-body font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((a) => (
                  <TableRow key={a.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="whitespace-nowrap font-body"><span className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</span></TableCell>
                    <TableCell className="font-body font-medium">{a.activity_name}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{a.description || "-"}</TableCell>
                  </TableRow>
                ))}
                {activities.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="py-12 text-center"><p className="font-display text-muted-foreground">No schedule available.</p></TableCell></TableRow>
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
