import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/class-links")({
  component: AdminClassLinks,
});

const classList = ["Playgroup", "Nursery", "LKG", "UKG", "Daycare"];

function AdminClassLinks() {
  const [links, setLinks] = useState<Record<string, { id: string; title: string; url: string }>>({});
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("class_links").select("*");
    if (data) {
      const map: Record<string, any> = {};
      data.forEach((l: any) => { map[l.class] = l; });
      setLinks(map);
    }
  }

  useEffect(() => { load(); }, []);

  function setField(cls: string, field: "title" | "url", value: string) {
    setLinks((prev) => ({
      ...prev,
      [cls]: { ...prev[cls], title: prev[cls]?.title || "", url: prev[cls]?.url || "", [field]: value },
    }));
  }

  async function save(cls: string) {
    const link = links[cls];
    if (!link || !link.url) return;
    setSaving(true);
    const record = { class: cls, title: link.title || cls + " Resources", url: link.url };
    if (link.id) {
      await supabase.from("class_links").update(record).eq("id", link.id);
    } else {
      await supabase.from("class_links").insert(record);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Class Links</h1>
        <p className="text-muted-foreground">Manage Google Drive resource links for each class</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classList.map((cls) => (
          <Card key={cls}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{cls}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  value={links[cls]?.title || ""}
                  onChange={(e) => setField(cls, "title", e.target.value)}
                  placeholder="e.g. LKG Learning Resources"
                />
              </div>
              <div>
                <Label className="text-xs">Google Drive URL</Label>
                <Input
                  value={links[cls]?.url || ""}
                  onChange={(e) => setField(cls, "url", e.target.value)}
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <Button onClick={() => save(cls)} disabled={saving} size="sm" className="w-full">
                {links[cls]?.id ? "Update" : "Save"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
