import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/daily-performance")({
  component: AdminDailyPerformance,
});

const domains = [
  { key: "cognitive", label: "Cognitive Development" },
  { key: "language_literacy", label: "Language & Literacy" },
  { key: "mathematics", label: "Mathematics" },
  { key: "physical", label: "Physical Development" },
  { key: "social_emotional", label: "Social & Emotional" },
  { key: "aesthetic_cultural", label: "Aesthetic & Cultural" },
];

function AdminDailyPerformance() {
  const today = new Date().toISOString().split("T")[0];
  const [students, setStudents] = useState<any[]>([]);
  const [performances, setPerformances] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [date, setDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [classFilter, setClassFilter] = useState("all");

  const classes = [...new Set(students.map((s) => s.class))].sort();
  const filteredStudents = classFilter === "all" ? students : students.filter((s) => s.class === classFilter);

  async function load() {
    const { data: studentsData } = await supabase
      .from("students").select("id, full_name, class").eq("status", "active").order("full_name");
    if (studentsData) setStudents(studentsData);

    const { data: perfData } = await supabase
      .from("daily_performance").select("*").eq("date", date);
    if (perfData) {
      const map: Record<string, any> = {};
      const notesMap: Record<string, string> = {};
      perfData.forEach((p: any) => {
        map[p.student_id] = p;
        notesMap[p.student_id] = p.notes || "";
      });
      setPerformances(map);
      setNotes(notesMap);
    }
  }

  useEffect(() => { load(); }, [date]);

  function getRating(studentId: string, domain: string): number | null {
    return performances[studentId]?.[domain] ?? null;
  }

  function setRating(studentId: string, domain: string, rating: number | null) {
    setPerformances((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [domain]: rating },
    }));
  }

  async function saveAll() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const student of filteredStudents) {
      const perf = performances[student.id];
      if (!perf) continue;
      const hasRating = domains.some((d) => perf[d.key]);
      if (!hasRating) continue;

      const record = {
        student_id: student.id,
        date,
        cognitive: perf.cognitive ?? null,
        language_literacy: perf.language_literacy ?? null,
        mathematics: perf.mathematics ?? null,
        physical: perf.physical ?? null,
        social_emotional: perf.social_emotional ?? null,
        aesthetic_cultural: perf.aesthetic_cultural ?? null,
        notes: notes[student.id] || null,
        created_by: user.id,
      };

      if (performances[student.id]?.id) {
        await supabase.from("daily_performance").update(record).eq("id", performances[student.id].id);
      } else {
        await supabase.from("daily_performance").insert(record);
      }

      // Notify parent
      const { data: s } = await supabase.from("students").select("parent_id").eq("id", student.id).single();
      if (s) {
        await supabase.from("notifications").insert({
          user_id: s.parent_id,
          title: "Daily Performance Updated",
          message: `Daily performance for ${student.full_name} on ${date} has been updated.`,
          type: "report",
        });
      }
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Performance</h1>
          <p className="text-muted-foreground">Rate each student's daily performance across learning domains</p>
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <Label className="text-xs">Class</Label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44" />
          </div>
          <Button onClick={saveAll} disabled={saving}>
            {saving ? "Saving..." : "Save All Ratings"}
          </Button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No active students found.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <Card key={student.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{student.class}</p>
                  </div>
                  {performances[student.id]?.id && <Badge variant="outline">Saved</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {domains.map((d) => (
                    <div key={d.key}>
                      <p className="text-xs font-medium mb-1.5 truncate">{d.label}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            className={`w-8 h-8 rounded-md text-sm font-medium border transition-colors ${
                              getRating(student.id, d.key) === n
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted text-muted-foreground"
                            }`}
                            onClick={() => setRating(student.id, d.key, getRating(student.id, d.key) === n ? null : n)}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <Label className="text-xs">Notes (optional)</Label>
                  <Input
                    placeholder="Add notes for this student..."
                    value={notes[student.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [student.id]: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
