import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/management/FileUpload";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/files")({
  component: AdminFiles,
});

const typeColors: Record<string, string> = {
  report_card: "default",
  certificate: "secondary",
  homework: "outline",
  activity: "secondary",
  photo: "destructive",
};

function AdminFiles() {
  const [files, setFiles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function loadFiles() {
    const { data } = await supabase
      .from("files")
      .select("*, students(full_name)")
      .order("created_at", { ascending: false });
    if (data) setFiles(data as any[]);
  }

  useEffect(() => { loadFiles(); }, []);

  async function remove(id: string) {
    await supabase.from("files").delete().eq("id", id);
    loadFiles();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">File Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Upload File</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload File</DialogTitle></DialogHeader>
            <FileUpload onUploaded={() => { setOpen(false); loadFiles(); }} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>All Files</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={f.url} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(f.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No files uploaded.</TableCell></TableRow>}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
