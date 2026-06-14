import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
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
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Daily Rhythm" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">Manage the daily preschool schedule.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-bamboo font-display text-sm font-bold text-white shadow-soft hover:shadow-lift" onClick={() => openEdit()}>
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-primary/10">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-extrabold">
                  <GradientText text={editing ? "Edit Activity" : "Add Activity"} />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Activity Name</Label>
                  <Input value={form.activity_name} onChange={(e) => setForm({ ...form, activity_name: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Start Time</Label>
                    <Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="rounded-xl border-primary/20" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">End Time</Label>
                    <Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="rounded-xl border-primary/20" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border-primary/20" rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Sort Order</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="rounded-xl border-primary/20" />
                </div>
                <Button onClick={save} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">{editing ? "Update" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Time</TableHead>
                  <TableHead className="font-body font-semibold">Activity</TableHead>
                  <TableHead className="font-body font-semibold">Description</TableHead>
                  <TableHead className="font-body font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((a) => (
                  <TableRow key={a.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="whitespace-nowrap font-body"><span className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</span></TableCell>
                    <TableCell className="font-body font-medium">{a.activity_name}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{a.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => openEdit(a)} className="rounded-lg text-xs font-bold">Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(a.id)} className="rounded-lg text-xs font-bold">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {activities.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="py-12 text-center"><p className="font-display text-muted-foreground">No activities scheduled.</p></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
