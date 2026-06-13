import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>New Announcement</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Content</Label><Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
              <Button onClick={save} className="w-full">Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <Badge variant={typeColors[a.type] as any}>{a.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
            </CardHeader>
            <CardContent><p className="whitespace-pre-wrap">{a.content}</p></CardContent>
          </Card>
        ))}
        {announcements.length === 0 && <p className="text-center text-muted-foreground">No announcements yet.</p>}
      </div>
    </div>
  );
}
