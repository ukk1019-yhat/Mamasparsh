import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { Student } from "@/types/database";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

function AdminStudents() {
  const [students, setStudents] = useState<(Student & { parent_email?: string })[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", parent_id: "", class: "", date_of_birth: "", gender: "male", admission_date: "" });
  const [parents, setParents] = useState<{ id: string; full_name: string }[]>([]);

  async function loadStudents() {
    const { data } = await supabase.from("students").select("*, profiles!inner(full_name)").order("created_at", { ascending: false });
    if (data) setStudents(data as any);
    setLoading(false);
  }

  async function loadParents() {
    const { data } = await supabase.from("profiles").select("id, full_name").eq("role", "parent").eq("status", "approved");
    if (data) setParents(data);
  }

  async function addStudent() {
    await supabase.from("students").insert({ ...form, status: "active" });
    setOpen(false);
    setForm({ full_name: "", parent_id: "", class: "", date_of_birth: "", gender: "male", admission_date: "" });
    loadStudents();
  }

  async function toggleStatus(id: string, status: string) {
    await supabase.from("students").update({ status: status === "active" ? "rejected" : "active" }).eq("id", id);
    loadStudents();
  }

  useEffect(() => { loadStudents(); loadParents(); }, []);

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Student Management" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">Manage student records and enrollment.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-bamboo font-display text-sm font-bold text-white shadow-soft hover:shadow-lift">
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-primary/10">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-extrabold">
                  <GradientText text="Add New Student" />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Full Name</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Parent</Label>
                  <Select value={form.parent_id} onValueChange={(v) => setForm({ ...form, parent_id: v })}>
                    <SelectTrigger className="rounded-xl border-primary/20"><SelectValue placeholder="Select parent" /></SelectTrigger>
                    <SelectContent>
                      {parents.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Class</Label>
                  <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
                    <SelectTrigger className="rounded-xl border-primary/20"><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {["Playgroup", "Nursery", "LKG", "UKG"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Date of Birth</Label>
                    <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="rounded-xl border-primary/20" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                      <SelectTrigger className="rounded-xl border-primary/20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Admission Date</Label>
                  <Input type="date" value={form.admission_date} onChange={(e) => setForm({ ...form, admission_date: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <Button onClick={addStudent} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">
                  Add Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-sky-400/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">All Students</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Name</TableHead>
                  <TableHead className="font-body font-semibold">Class</TableHead>
                  <TableHead className="font-body font-semibold">Parent</TableHead>
                  <TableHead className="font-body font-semibold">Status</TableHead>
                  <TableHead className="font-body font-semibold">Admission</TableHead>
                  <TableHead className="font-body font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="py-12 text-center"><p className="font-display text-muted-foreground">Loading students...</p></TableCell></TableRow>
                ) : students.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-12 text-center"><p className="font-display text-muted-foreground">No students yet.</p></TableCell></TableRow>
                ) : students.map((s) => (
                  <TableRow key={s.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="font-body font-medium">{s.full_name}</TableCell>
                    <TableCell className="font-body text-muted-foreground">
                      <Badge variant="outline" className="rounded-full font-body text-xs">{s.class}</Badge>
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">{(s as any).profiles?.full_name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "default" : "secondary"} className="rounded-full font-body text-xs">{s.status}</Badge>
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">{new Date(s.admission_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant={s.status === "active" ? "destructive" : "default"} onClick={() => toggleStatus(s.id, s.status)} className="rounded-lg text-xs font-bold">
                        {s.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
