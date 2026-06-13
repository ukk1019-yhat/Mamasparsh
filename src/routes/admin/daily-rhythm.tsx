import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import type { DailyRhythm } from "@/types/database";

export const Route = createFileRoute("/admin/daily-rhythm")({
  component: AdminDailyRhythm,
});

function AdminDailyRhythm() {
  const [activities, setActivities] = useState<DailyRhythm[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DailyRhythm | null>(null);
  const [form, setForm] = useState({ activity_name: "", start_time: "", end_time: "", description: "", sort_order: 0 });

  async function loadActivities() {
    const { data } = await supabase.from("daily_rhythm").select("*").order("sort_order");
    if (data) setActivities(data as DailyRhythm[]);
  }

  function openEdit(a?: DailyRhythm) {
    if (a) {
      setEditing(a);
      setForm({ activity_name: a.activity_name, start_time: a.start_time.slice(0, 5), end_time: a.end_time.slice(0, 5), description: a.description || "", sort_order: a.sort_order });
    } else {
      setEditing(null);
      setForm({ activity_name: "", start_time: "", end_time: "", description: "", sort_order: activities.length + 1 });
    }
    setOpen(true);
  }

  async function save() {
    if (editing) {
      await supabase.from("daily_rhythm").update(form).eq("id", editing.id);
    } else {
      await supabase.from("daily_rhythm").insert(form);
    }
    setOpen(false);
    loadActivities();
  }

  async function remove(id: string) {
    await supabase.from("daily_rhythm").delete().eq("id", id);
    loadActivities();
  }

  useEffect(() => { loadActivities(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Daily Rhythm</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => openEdit()}>Add Activity</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Activity</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Activity Name</Label><Input value={form.activity_name} onChange={(e) => setForm({ ...form, activity_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Time</Label><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
                <div><Label>End Time</Label><Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} /></div>
              <Button onClick={save} className="w-full">{editing ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</TableCell>
                  <TableCell className="font-medium">{a.activity_name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.description || "-"}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(a)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(a.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {activities.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center">No activities scheduled.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
