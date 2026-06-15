import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { Announcement } from "@/types/database";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "news" });

  async function load() {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (data) setAnnouncements(data as Announcement[]);
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("announcements").insert({ ...form, created_by: user.id });
    setOpen(false);
    setForm({ title: "", content: "", type: "news" });
    load();
  }

  useEffect(() => { load(); }, []);

  const typeColors: Record<string, string> = { news: "default", event: "secondary", holiday: "destructive", update: "outline" };

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="Announcements" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">Post updates, events, and notices for parents.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-bamboo font-display text-sm font-bold text-white shadow-soft hover:shadow-lift">
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-primary/10">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-extrabold">
                  <GradientText text="New Announcement" />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="rounded-xl border-primary/20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Content</Label>
                  <Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="rounded-xl border-primary/20" />
                </div>
                <Button onClick={save} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">Post</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      <div className="space-y-4">
        {announcements.map((a, idx) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
            <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow hover:shadow-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg font-bold">{a.title}</CardTitle>
                  <Badge variant={typeColors[a.type] as any} className="rounded-full font-body text-xs uppercase tracking-wider">{a.type}</Badge>
                </div>
                <p className="font-body text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </CardHeader>
              <CardContent>
                <p className="font-body whitespace-pre-wrap text-muted-foreground">{a.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {announcements.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
            <p className="font-display text-muted-foreground">No announcements yet.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
