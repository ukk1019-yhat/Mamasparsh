import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";

type PlannerEntry = {
  id: string;
  title: string;
  content: string;
  target_class: string | null;
  created_by: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/academic-planner")({
  component: AdminAcademicPlanner,
});

const classOptions = ["Playgroup", "Nursery", "LKG", "UKG", "Daycare"];

function AdminAcademicPlanner() {
  const [entries, setEntries] = useState<PlannerEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PlannerEntry | null>(null);
  const [classFilter, setClassFilter] = useState("all");
  const [form, setForm] = useState({ title: "", content: "", target_class: "" });

  async function load() {
    const { data } = await supabase.from("academic_planner").select("*").order("created_at", { ascending: false });
    if (data) setEntries(data as PlannerEntry[]);
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const record = {
      title: form.title,
      content: form.content,
      target_class: form.target_class || null,
      created_by: user.id,
    };
    if (editing) {
      await supabase.from("academic_planner").update(record).eq("id", editing.id);
    } else {
      await supabase.from("academic_planner").insert(record);
    }
    setOpen(false);
    setEditing(null);
    setForm({ title: "", content: "", target_class: "" });
    load();
  }

  function openEdit(entry?: PlannerEntry) {
    if (entry) {
      setEditing(entry);
      setForm({ title: entry.title, content: entry.content, target_class: entry.target_class || "" });
    } else {
      setEditing(null);
      setForm({ title: "", content: "", target_class: "" });
    }
    setOpen(true);
  }

  async function deleteEntry(id: string) {
    await supabase.from("academic_planner").delete().eq("id", id);
    load();
  }

  useEffect(() => { load(); }, []);

  const filtered = classFilter === "all"
    ? entries
    : entries.filter((e) => !e.target_class || e.target_class === classFilter);

  const classes = [...new Set(entries.filter((e) => e.target_class).map((e) => e.target_class!))].sort();

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Academic Planner" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">Share academic plans, updates, and notices with parents by class.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-40 rounded-xl border-primary/20">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-gradient-bamboo font-display text-sm font-bold text-white shadow-soft hover:shadow-lift" onClick={() => openEdit()}>
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl border-primary/10 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-extrabold">
                    <GradientText text={editing ? "Edit Entry" : "New Entry"} />
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border-primary/20" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Target Class (optional)</Label>
                    <Select value={form.target_class} onValueChange={(v) => setForm({ ...form, target_class: v === "all" ? "" : v })}>
                      <SelectTrigger className="rounded-xl border-primary/20"><SelectValue placeholder="All classes" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classOptions.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm font-semibold">Content</Label>
                    <Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="rounded-xl border-primary/20" />
                  </div>
                  <Button onClick={save} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">
                    {editing ? "Update" : "Post"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>
      <div className="space-y-4">
        {filtered.map((e, idx) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
            <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow hover:shadow-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-display text-lg font-bold">{e.title}</CardTitle>
                    {e.target_class && <Badge variant="outline" className="rounded-full text-xs">{e.target_class}</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(e)} className="rounded-lg text-xs font-bold">Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 w-7 rounded-full p-0 text-muted-foreground hover:text-destructive">✕</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete "{e.title}". This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteEntry(e.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="font-body text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </CardHeader>
              <CardContent>
                <p className="font-body whitespace-pre-wrap text-muted-foreground">{e.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
            <p className="font-display text-muted-foreground">No entries yet.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
