import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/parent/report-cards")({
  component: ParentReportCards,
});

const domainLabels: Record<string, string> = {
  cognitive: "Cognitive Development",
  language_literacy: "Language & Literacy",
  mathematics: "Mathematics",
  physical: "Physical Development",
  social_emotional: "Social & Emotional",
  aesthetic_cultural: "Aesthetic & Cultural",
};

function ParentReportCards() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("report_cards").select("*, students!inner(full_name, class, parent_id)").eq("students.parent_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setReports(data as any[]);
      });
    });
  }, []);

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Report Cards" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">View your child&apos;s progress reports.</p>
      </motion.div>
      {reports.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="rounded-2xl border border-primary/5 shadow-soft">
            <CardContent className="py-12 text-center font-display text-muted-foreground">
              No report cards available.
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reports.map((r, idx) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
              <Card className="h-full overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow hover:shadow-lift">
                <CardHeader className="bg-gradient-to-r from-purple-400/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-lg font-bold">{r.students?.full_name}</CardTitle>
                    <Badge variant="secondary" className="rounded-full font-body text-xs">{r.term}</Badge>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{r.students?.class} - {r.academic_year}</p>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl font-body text-xs font-bold">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl rounded-2xl border-primary/10">
                      <DialogHeader>
                        <DialogTitle className="font-display text-xl font-extrabold">
                          <GradientText text={`Report Card - ${r.students?.full_name}`} />
                        </DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[60vh] space-y-6 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/30 p-4 font-body text-sm">
                          <div><span className="font-semibold">Class:</span> {r.students?.class}</div>
                          <div><span className="font-semibold">Academic Year:</span> {r.academic_year}</div>
                          <div><span className="font-semibold">Term:</span> {r.term}</div>
                          <div><span className="font-semibold">Generated:</span> {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                        </div>
                        {["cognitive", "language_literacy", "mathematics", "physical", "social_emotional", "aesthetic_cultural"].map((domain) => {
                          const scores = r[domain];
                          if (!scores || Object.keys(scores).length === 0) return null;
                          return (
                            <div key={domain}>
                              <h3 className="mb-2 font-display font-bold">{domainLabels[domain]}</h3>
                              <div className="space-y-1">
                                {Object.entries(scores).map(([skill, rating]) => (
                                  <div key={skill} className="flex items-center justify-between rounded-lg border border-primary/5 px-3 py-2 font-body text-sm">
                                    <span>{skill}</span>
                                    <Badge variant="outline" className="rounded-full font-body text-xs">{rating as string}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        {r.teacher_remarks && (
                          <div className="rounded-xl bg-accent/5 p-4">
                            <h3 className="mb-1 font-display font-bold">Teacher Remarks</h3>
                            <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap">{r.teacher_remarks}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
