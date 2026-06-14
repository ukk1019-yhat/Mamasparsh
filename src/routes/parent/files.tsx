import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { FileRecord } from "@/types/database";

export const Route = createFileRoute("/parent/files")({
  component: ParentFiles,
});

function ParentFiles() {
  const [files, setFiles] = useState<FileRecord[]>([]);

  useEffect(() => {
    supabase.from("files").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setFiles(data as FileRecord[]);
    });
  }, []);

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Resources & Files" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Access worksheets, circulars, and resources.</p>
      </motion.div>
      {files.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="rounded-2xl border border-primary/5 shadow-soft">
            <CardContent className="py-12 text-center font-display text-muted-foreground">
              No files available yet.
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {files.map((f, idx) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
              <Card className="group h-full overflow-hidden rounded-2xl border border-primary/5 shadow-soft transition-shadow hover:shadow-lift">
                <CardHeader className="bg-gradient-to-r from-amber-400/10 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-500" />
                      <CardTitle className="font-display text-base font-bold truncate max-w-[200px]">{f.title}</CardTitle>
                    </div>
                  </div>
                  {f.description && <p className="font-body text-xs text-muted-foreground mt-1">{f.description}</p>}
                </CardHeader>
                <CardContent className="space-y-3">
                  {f.category && (
                    <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 font-body text-xs font-semibold text-muted-foreground">{f.category}</span>
                  )}
                  <div className="flex gap-2">
                    <a href={f.file_url} target="_blank" rel="noopener noreferrer" download>
                      <Button size="sm" variant="default" className="rounded-xl bg-gradient-bamboo font-body text-xs font-bold text-white shadow-soft hover:shadow-lift">
                        <Download className="mr-1 h-3.5 w-3.5" /> Download
                      </Button>
                    </a>
                    <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="rounded-xl font-body text-xs font-bold">
                        <ExternalLink className="mr-1 h-3.5 w-3.5" /> View
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
