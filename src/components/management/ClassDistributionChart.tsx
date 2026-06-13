import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/lib/supabase";

const COLORS = ["hsl(142, 76%, 36%)", "hsl(217, 91%, 60%)", "hsl(48, 96%, 53%)", "hsl(271, 81%, 56%)"];

const chartConfig = {
  Playgroup: { label: "Playgroup", color: COLORS[0] },
  Nursery: { label: "Nursery", color: COLORS[1] },
  LKG: { label: "LKG", color: COLORS[2] },
  UKG: { label: "UKG", color: COLORS[3] },
};

export function ClassDistributionChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    supabase.from("students").select("class").eq("status", "active").then(({ data: rows }) => {
      if (!rows) return;
      const grouped: Record<string, number> = {};
      for (const r of rows) {
        grouped[r.class] = (grouped[r.class] || 0) + 1;
      }
      setData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
    });
  }, []);

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Class Distribution</CardTitle></CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[1/1] max-h-[250px]">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
