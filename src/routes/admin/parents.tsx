import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

export const Route = createFileRoute("/admin/parents")({
  component: AdminParents,
});

function AdminParents() {
  const [parents, setParents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadParents() {
    const { data } = await supabase.from("profiles").select("*").eq("role", "parent").order("created_at", { ascending: false });
    if (data) setParents(data as Profile[]);
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Parent Management</h1>
      <Card>
        <CardHeader><CardTitle>Registered Parents</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
              ) : parents.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center">No parents registered yet.</TableCell></TableRow>
              ) : parents.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.full_name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="space-x-2">
                    {p.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => updateStatus(p.id, "approved")}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, "rejected")}>Reject</Button>
                      </>
                    )}
                    {p.status === "approved" && (
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, "rejected")}>Reject</Button>
                    )}
                    {p.status === "rejected" && (
                      <Button size="sm" onClick={() => updateStatus(p.id, "approved")}>Approve</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
