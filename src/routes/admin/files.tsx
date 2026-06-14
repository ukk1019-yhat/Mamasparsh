import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/management/FileUpload";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
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
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              <GradientText text="File Management" />
            </h1>
            <p className="mt-1 font-body text-muted-foreground">Upload and manage student files and documents.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-bamboo font-display text-sm font-bold text-white shadow-soft hover:shadow-lift">
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-primary/10">
              <DialogHeader>
                <DialogTitle className="font-display text-xl font-extrabold">
                  <GradientText text="Upload File" />
                </DialogTitle>
              </DialogHeader>
              <FileUpload onUploaded={() => { setOpen(false); loadFiles(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-teal-400/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">All Files</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Name</TableHead>
                  <TableHead className="font-body font-semibold">Type</TableHead>
                  <TableHead className="font-body font-semibold">Student</TableHead>
                  <TableHead className="font-body font-semibold">Uploaded</TableHead>
                  <TableHead className="font-body font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((f) => (
                  <TableRow key={f.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="max-w-[200px] truncate font-body font-medium">{f.name}</TableCell>
                    <TableCell><Badge variant={typeColors[f.type] as any} className="rounded-full font-body text-xs">{f.type.replace("_", " ")}</Badge></TableCell>
                    <TableCell className="font-body text-muted-foreground">{f.students?.full_name || "-"}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" asChild className="rounded-lg text-xs font-bold">
                          <a href={f.url} target="_blank" rel="noopener noreferrer">View</a>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(f.id)} className="rounded-lg text-xs font-bold">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {files.length === 0 && <TableRow><TableCell colSpan={5} className="py-12 text-center"><p className="font-display text-muted-foreground">No files uploaded.</p></TableCell></TableRow>}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
