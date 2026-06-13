import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/report-cards")({
  component: AdminReportCards,
});

const domains = [
  { key: "cognitive", label: "Cognitive Development" },
  { key: "language_literacy", label: "Language & Literacy" },
  { key: "mathematics", label: "Mathematics" },
  { key: "physical", label: "Physical Development" },
  { key: "social_emotional", label: "Social & Emotional" },
  { key: "aesthetic_cultural", label: "Aesthetic & Cultural" },
];

const ratings = ["Not Yet", "Emerging", "Developing", "Achieved", "Exceeding"];

function AdminReportCards() {
  const [students, setStudents] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [form, setForm] = useState<any>({ academic_year: "2025-2026", term: "Term 1", teacher_remarks: "" });
  const domainScores: Record<string, Record<string, string>> = {};
  domains.forEach((d) => { domainScores[d.key] = {}; });

  useEffect(() => {
    supabase.from("students").select("id, full_name, class").eq("status", "active").then(({ data }) => {
      if (data) setStudents(data);
    });
    supabase.from("report_cards").select("*, students(full_name, class)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setReports(data as any[]);
    });
  }, []);

  async function save() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const record: any = { ...form, student_id: selectedStudentId, generated_by: user.id };
    domains.forEach((d) => { record[d.key] = domainScores[d.key]; });
    await supabase.from("report_cards").insert(record);
    setOpen(false);
    setSelectedStudentId("");
    setForm({ academic_year: "2025-2026", term: "Term 1", teacher_remarks: "" });
    supabase.from("report_cards").select("*, students(full_name, class)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setReports(data as any[]);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Report Cards</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Generate Report Card</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Generate Report Card</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Student</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.class})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Academic Year</Label>
                  <Select value={form.academic_year} onValueChange={(v) => setForm({ ...form, academic_year: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Term</Label>
                  <Select value={form.term} onValueChange={(v) => setForm({ ...form, term: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Term 1">Term 1</SelectItem>
                      <SelectItem value="Term 2">Term 2</SelectItem>
                      <SelectItem value="Term 3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {domains.map((d) => (
                <div key={d.key} className="space-y-2">
                  <Label className="font-medium">{d.label}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {ratings.map((r) => (
                      <Button
                        key={r}
                        type="button"
                        variant={domainScores[d.key]?.skill1 === r ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const key = prompt(`Enter skill name for ${d.label} (e.g. "Problem Solving"):`);
                          if (key) domainScores[d.key][key] = r;
                        }}
                      >
                        {r}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <div><Label>Teacher Remarks</Label><Textarea rows={3} value={form.teacher_remarks} onChange={(e) => setForm({ ...form, teacher_remarks: e.target.value })} /></div>
              <Button onClick={save} className="w-full">Generate</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Generated Report Cards</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Generated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.students?.full_name}</TableCell>
                  <TableCell>{r.students?.class}</TableCell>
                  <TableCell>{r.academic_year}</TableCell>
                  <TableCell><Badge variant="secondary">{r.term}</Badge></TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No report cards yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
