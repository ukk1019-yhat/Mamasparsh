import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/parent/files")({
  component: ParentFiles,
});

const typeColors: Record<string, string> = {
  report_card: "default",
  certificate: "secondary",
  homework: "outline",
  activity: "secondary",
  photo: "destructive",
};

function ParentFiles() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("students").select("id").eq("parent_id", user.id).then(({ data: students }) => {
        if (!students || students.length === 0) return;
        supabase
          .from("files")
          .select("*, students(full_name)")
          .in("student_id", students.map((s: any) => s.id))
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            if (data) setFiles(data as any[]);
          });
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Files</h1>
      <Card>
        <CardHeader><CardTitle>Shared Files</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{f.name}</TableCell>
                  <TableCell><Badge variant={typeColors[f.type] as any}>{f.type.replace("_", " ")}</Badge></TableCell>
                  <TableCell>{f.students?.full_name || "-"}</TableCell>
                  <TableCell>{new Date(f.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" asChild>
                      <a href={f.url} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No files shared yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
