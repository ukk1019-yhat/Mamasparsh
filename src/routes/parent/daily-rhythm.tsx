import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import type { DailyRhythm } from "@/types/database";

export const Route = createFileRoute("/parent/daily-rhythm")({
  component: ParentDailyRhythm,
});

function ParentDailyRhythm() {
  const [activities, setActivities] = useState<DailyRhythm[]>([]);

  useEffect(() => {
    supabase.from("daily_rhythm").select("*").order("sort_order").then(({ data }) => {
      if (data) setActivities(data as DailyRhythm[]);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Daily Rhythm</h1>
      <Card>
        <CardHeader><CardTitle>Today&apos;s Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap font-medium">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</TableCell>
                  <TableCell>{a.activity_name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.description || "-"}</TableCell>
                </TableRow>
              ))}
              {activities.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center">No schedule available.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
