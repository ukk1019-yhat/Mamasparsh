import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

export const Route = createFileRoute("/admin/parents")({
  component: AdminParents,
});

function AdminParents() {
  const [parents, setParents] = useState<Profile[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, { full_name: string; class: string }[]>>({});
  const [loading, setLoading] = useState(true);

  async function loadParents() {
    const { data } = await supabase.from("profiles").select("*").eq("role", "parent").order("created_at", { ascending: false });
    if (data) setParents(data as Profile[]);

    const { data: students } = await supabase.from("students").select("parent_id, full_name, class");
    if (students) {
      const map: Record<string, { full_name: string; class: string }[]> = {};
      students.forEach((s: any) => {
        if (!map[s.parent_id]) map[s.parent_id] = [];
        map[s.parent_id].push({ full_name: s.full_name, class: s.class });
      });
      setChildrenMap(map);
    }

    setLoading(false);
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    await supabase.from("profiles").update({ status }).eq("id", id);
    await supabase.from("notifications").insert({
      user_id: id,
      title: status === "approved" ? "Account Approved" : "Account Rejected",
      message: status === "approved" ? "Your account has been approved. You can now log in and manage your children." : "Your account has been rejected. Please contact the school for more information.",
      type: "approval",
    });
    loadParents();
  }

  useEffect(() => { loadParents(); }, []);

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Parent Management" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Manage parent registrations and approvals.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Registered Parents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-body font-semibold">Name</TableHead>
                  <TableHead className="font-body font-semibold">Email</TableHead>
                  <TableHead className="font-body font-semibold">Phone</TableHead>
                  <TableHead className="font-body font-semibold">Children</TableHead>
                  <TableHead className="font-body font-semibold">Status</TableHead>
                  <TableHead className="font-body font-semibold">Registered</TableHead>
                  <TableHead className="font-body font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="py-12 text-center"><p className="font-display text-muted-foreground">Loading parents...</p></TableCell></TableRow>
                ) : parents.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="py-12 text-center"><p className="font-display text-muted-foreground">No parents registered yet.</p></TableCell></TableRow>
                ) : parents.map((p) => {
                  const kids = childrenMap[p.id] || [];
                  return (
                  <TableRow key={p.id} className="border-b border-primary/5 transition-colors hover:bg-primary/[0.02]">
                    <TableCell className="font-body font-medium">{p.full_name}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{p.phone || "-"}</TableCell>
                    <TableCell className="font-body text-muted-foreground">
                      {kids.length === 0 ? (
                        <span className="text-xs italic">None</span>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          {kids.map((k, i) => (
                            <span key={i} className="text-xs">
                              {k.full_name} <span className="text-muted-foreground/60">({k.class})</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "secondary"} className="rounded-full font-body text-xs">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        {p.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => updateStatus(p.id, "approved")} className="rounded-lg bg-gradient-bamboo text-xs font-bold text-white shadow-soft hover:shadow-lift">Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, "rejected")} className="rounded-lg text-xs font-bold">Reject</Button>
                          </>
                        )}
                        {p.status === "approved" && (
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, "rejected")} className="rounded-lg text-xs font-bold">Reject</Button>
                        )}
                        {p.status === "rejected" && (
                          <Button size="sm" onClick={() => updateStatus(p.id, "approved")} className="rounded-lg bg-gradient-bamboo text-xs font-bold text-white shadow-soft hover:shadow-lift">Approve</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
