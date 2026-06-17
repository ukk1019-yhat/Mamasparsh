import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
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
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Report Cards" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">Generate and manage student report cards.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-bamboo font-display text-sm font-bold text-white shadow-soft hover:shadow-lift">
                Generate Report Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-2xl border-primary/10">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-extrabold">
                  <GradientText text="Generate Report Card" />
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] space-y-4 overflow-y-auto">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Student</Label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="rounded-xl border-primary/20"><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.class})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Academic Year</Label>
                    <Select value={form.academic_year} onValueChange={(v) => setForm({ ...form, academic_year: v })}>
                      <SelectTrigger className="rounded-xl border-primary/20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                        <SelectItem value="2026-2027">2026-2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Term</Label>
                    <Select value={form.term} onValueChange={(v) => setForm({ ...form, term: v })}>
                      <SelectTrigger className="rounded-xl border-primary/20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Term 1">Term 1</SelectItem>
                        <SelectItem value="Term 2">Term 2</SelectItem>
                        <SelectItem value="Term 3">Term 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {domains.map((d) => (
                  <div key={d.key} className="space-y-2 rounded-xl border border-primary/5 bg-muted/30 p-3">
                    <Label className="font-body text-sm font-bold">{d.label}</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {ratings.map((r) => (
                        <Button
                          key={r}
                          type="button"
                          variant={domainScores[d.key]?.skill1 === r ? "default" : "outline"}
                          size="sm"
                          className="rounded-lg text-xs"
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
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Teacher Remarks</Label>
                  <Textarea rows={3} value={form.teacher_remarks} onChange={(e) => setForm({ ...form, teacher_remarks: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <Button onClick={save} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">Generate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-purple-400/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Generated Report Cards</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Student</TableHead>
                  <TableHead className="font-body font-semibold">Class</TableHead>
                  <TableHead className="font-body font-semibold">Year</TableHead>
                  <TableHead className="font-body font-semibold">Term</TableHead>
                  <TableHead className="font-body font-semibold">Generated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="font-body font-medium">{r.students?.full_name}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{r.students?.class}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{r.academic_year}</TableCell>
                    <TableCell><Badge variant="secondary" className="rounded-full font-body text-xs">{r.term}</Badge></TableCell>
                    <TableCell className="font-body text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && <TableRow><TableCell colSpan={5} className="py-12 text-center"><p className="font-display text-muted-foreground">No report cards yet.</p></TableCell></TableRow>}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
