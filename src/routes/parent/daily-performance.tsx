import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/parent/daily-performance")({
  component: ParentDailyPerformance,
});

const domains = [
  { key: "cognitive", label: "Cognitive Development" },
  { key: "language_literacy", label: "Language & Literacy" },
  { key: "mathematics", label: "Mathematics" },
  { key: "physical", label: "Physical Development" },
  { key: "social_emotional", label: "Social & Emotional" },
  { key: "aesthetic_cultural", label: "Aesthetic & Cultural" },
];

const colorMap: Record<string, string> = {
  "Not Yet": "bg-red-100 text-red-700",
  "Emerging": "bg-orange-100 text-orange-700",
  "Developing": "bg-yellow-100 text-yellow-700",
  "Achieved": "bg-green-100 text-green-700",
  "Exceeding": "bg-blue-100 text-blue-700",
};

function ParentDailyPerformance() {
  const today = new Date().toISOString().split("T")[0];
  const [students, setStudents] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("students").select("id, full_name, class").eq("parent_id", user.id).then(({ data: sData }) => {
        if (!sData || sData.length === 0) { setLoading(false); return; }
        setStudents(sData);
        supabase
          .from("daily_performance")
          .select("*")
          .in("student_id", sData.map((s: any) => s.id))
          .eq("date", date)
          .then(({ data: pData }) => {
            if (pData) setPerformances(pData);
            setLoading(false);
          });
      });
    });
  }, [date]);

  const perfMap: Record<string, any> = {};
  performances.forEach((p) => { perfMap[p.student_id] = p; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Performance</h1>
          <p className="text-muted-foreground">View your children's daily performance ratings</p>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44" />
        </div>
      </div>

      {loading ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
      ) : students.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No children registered.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {students.map((student) => {
            const perf = perfMap[student.id];
            return (
              <Card key={student.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{student.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{student.class}</p>
                </CardHeader>
                <CardContent>
                  {!perf ? (
                    <p className="text-sm text-muted-foreground">No performance ratings for this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {domains.map((d) => {
                        const rating = perf[d.key];
                        return (
                          <div key={d.key}>
                            <p className="text-xs font-medium mb-1 text-muted-foreground">{d.label}</p>
                            {rating ? (
                              <span className={`inline-block text-xs font-medium px-2 py-1 rounded-md ${colorMap[rating] || "bg-muted text-muted-foreground"}`}>
                                {rating}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {perf?.notes && (
                    <p className="text-sm text-muted-foreground mt-3 border-t pt-3">
                      <span className="font-medium">Notes:</span> {perf.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
