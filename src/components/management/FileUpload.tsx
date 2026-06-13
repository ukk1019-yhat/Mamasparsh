import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

type FileType = "report_card" | "certificate" | "homework" | "activity" | "photo";

interface FileUploadProps {
  studentId?: string;
  onUploaded: () => void;
}

export function FileUpload({ studentId, onUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<FileType>("activity");
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async () => {
    if (!file) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const bucket = studentId ? `students/${studentId}` : "general";
      const filePath = `${bucket}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("files").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("files").getPublicUrl(filePath);

      await supabase.from("files").insert({
        name: file.name,
        url: publicUrl,
        type,
        student_id: studentId || null,
        uploaded_by: user.id,
      });

      setFile(null);
      onUploaded();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }, [file, type, studentId, onUploaded]);

  return (
    <div className="space-y-4">
      <div>
        <Label>File</Label>
        <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as FileType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="activity">Activity</SelectItem>
            <SelectItem value="report_card">Report Card</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="homework">Homework</SelectItem>
            <SelectItem value="photo">Photo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={upload} disabled={!file || uploading} className="w-full">
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
