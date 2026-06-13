import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import type { Announcement } from "@/types/database";

export const Route = createFileRoute("/parent/announcements")({
  component: ParentAnnouncements,
});

const typeColors: Record<string, string> = { news: "default", event: "secondary", holiday: "destructive", update: "outline" };

function ParentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    supabase.from("announcements").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setAnnouncements(data as Announcement[]);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
      {announcements.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No announcements yet.</CardContent></Card>
      ) : (
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
        </div>
      )}
    </div>
  );
}
