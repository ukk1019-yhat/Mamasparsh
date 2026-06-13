import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Add Student</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>Parent</Label>
                <Select value={form.parent_id} onValueChange={(v) => setForm({ ...form, parent_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger>
                  <SelectContent>
                    {parents.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Class</Label>
                <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {["Playgroup", "Nursery", "LKG", "UKG"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></div>
              <div><Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Admission Date</Label><Input type="date" value={form.admission_date} onChange={(e) => setForm({ ...form, admission_date: e.target.value })} /></div>
              <Button onClick={addStudent} className="w-full">Add Student</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>All Students</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admission</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
              ) : students.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center">No students yet.</TableCell></TableRow>
              ) : students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.full_name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell>{(s as any).profiles?.full_name || "-"}</TableCell>
                  <TableCell><Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
                  <TableCell>{new Date(s.admission_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant={s.status === "active" ? "destructive" : "default"} onClick={() => toggleStatus(s.id, s.status)}>
                      {s.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
