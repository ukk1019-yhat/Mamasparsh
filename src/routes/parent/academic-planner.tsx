import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";

type PlannerEntry = {
  id: string;
  title: string;
  content: string;
  target_class: string | null;
  created_at: string;
};

export const Route = createFileRoute("/parent/academic-planner")({
  component: ParentAcademicPlanner,
});

function ParentAcademicPlanner() {
  const [entries, setEntries] = useState<PlannerEntry[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("students").select("class").eq("parent_id", user.id).then(({ data }) => {
        const myClasses = [...new Set((data || []).map((s: any) => s.class))];
        supabase.from("academic_planner").select("*").order("created_at", { ascending: false }).then(({ data }) => {
          const all = (data || []) as PlannerEntry[];
          const filtered = all.filter((e) => !e.target_class || myClasses.includes(e.target_class));
          setEntries(filtered);
        });
      });
    });
  }, []);

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Academic Planner" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Stay updated with academic plans and class updates.</p>
      </motion.div>
      {entries.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="rounded-2xl border border-primary/5 shadow-soft">
            <CardContent className="py-12 text-center font-display text-muted-foreground">
              No entries yet.
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {entries.map((e, idx) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
              <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow hover:shadow-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-display text-lg font-bold">{e.title}</CardTitle>
                      {e.target_class && <Badge variant="outline" className="rounded-full text-xs">{e.target_class}</Badge>}
                    </div>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="font-body whitespace-pre-wrap text-muted-foreground">{e.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
