import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { supabase } from "@/lib/supabase";

const chartConfig = {
  present: { label: "Present", color: "hsl(142, 76%, 36%)" },
  absent: { label: "Absent", color: "hsl(0, 84%, 60%)" },
  leave: { label: "Leave", color: "hsl(48, 96%, 53%)" },
};

export function AttendanceChart() {
  const [data, setData] = useState<{ date: string; present: number; absent: number; leave: number }[]>([]);

  useEffect(() => {
    async function load() {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      const { data: rows } = await supabase
        .from("attendance")
        .select("date, status")
        .gte("date", start.toISOString().split("T")[0])
        .lte("date", end.toISOString().split("T")[0])
        .order("date");

      if (!rows) return;

      const grouped: Record<string, { present: number; absent: number; leave: number }> = {};
      for (const r of rows) {
        if (!grouped[r.date]) grouped[r.date] = { present: 0, absent: 0, leave: 0 };
        grouped[r.date][r.status as keyof typeof grouped[string]] += 1;
      }
      setData(Object.entries(grouped).map(([date, counts]) => ({ date: date.slice(5), ...counts })));
    }
    load();
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Attendance Trend (30 days)</CardTitle></CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[2/1]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="present" fill="var(--color-present)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="leave" fill="var(--color-leave)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
