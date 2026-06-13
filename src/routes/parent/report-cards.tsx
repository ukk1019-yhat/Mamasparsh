import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Report Cards</h1>
      {reports.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No report cards available.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{r.students?.full_name}</CardTitle>
                  <Badge variant="secondary">{r.term}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{r.students?.class} - {r.academic_year}</p>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View Details</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Report Card - {r.students?.full_name}</DialogTitle></DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">Class:</span> {r.students?.class}</div>
                        <div><span className="font-medium">Academic Year:</span> {r.academic_year}</div>
                        <div><span className="font-medium">Term:</span> {r.term}</div>
                        <div><span className="font-medium">Generated:</span> {new Date(r.created_at).toLocaleDateString()}</div>
                      </div>
                      {["cognitive", "language_literacy", "mathematics", "physical", "social_emotional", "aesthetic_cultural"].map((domain) => {
                        const scores = r[domain];
                        if (!scores || Object.keys(scores).length === 0) return null;
                        return (
                          <div key={domain}>
                            <h3 className="font-medium mb-2">{domainLabels[domain]}</h3>
                            <div className="space-y-1">
                              {Object.entries(scores).map(([skill, rating]) => (
                                <div key={skill} className="flex items-center justify-between text-sm border-b py-1">
                                  <span>{skill}</span>
                                  <Badge variant="outline">{rating as string}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {r.teacher_remarks && (
                        <div>
                          <h3 className="font-medium mb-1">Teacher Remarks</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.teacher_remarks}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
