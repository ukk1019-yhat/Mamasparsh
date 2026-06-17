import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { Announcement } from "@/types/database";

export const Route = createFileRoute("/parent/announcements")({
  component: ParentAnnouncements,
});

const typeColors: Record<string, string> = { news: "default", event: "secondary", holiday: "destructive", update: "outline" };

function ParentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("students").select("class").eq("parent_id", user.id).then(({ data }) => {
        const myClasses = [...new Set((data || []).map((s: any) => s.class))];
        setClasses(myClasses);
        supabase.from("announcements").select("*").order("created_at", { ascending: false }).then(({ data }) => {
          const all = (data || []) as Announcement[];
          const filtered = all.filter((a) => !a.target_class || myClasses.includes(a.target_class));
          setAnnouncements(filtered);
        });
      });
    });
  }, []);

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Announcements" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Stay updated with school news and events.</p>
      </motion.div>
      {announcements.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="rounded-2xl border border-primary/5 shadow-soft">
            <CardContent className="py-12 text-center font-display text-muted-foreground">
              No announcements yet.
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, idx) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
              <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow hover:shadow-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-display text-lg font-bold">{a.title}</CardTitle>
                      {a.target_class && <Badge variant="outline" className="rounded-full text-xs">{a.target_class}</Badge>}
                    </div>
                    <Badge variant={typeColors[a.type] as any} className="rounded-full font-body text-xs uppercase tracking-wider">{a.type}</Badge>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </CardHeader>
                <CardContent>
                  {a.image_url && (
                    <img src={a.image_url} alt="" className="mb-3 max-h-60 w-full rounded-xl object-cover" />
                  )}
                  <p className="font-body whitespace-pre-wrap text-muted-foreground">{a.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
