import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/parent/profile")({
  component: ParentProfile,
});

function ParentProfile() {
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [form, setForm] = useState({ full_name: "", class: "Playgroup", date_of_birth: "", gender: "male" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUser(user);
      supabase.from("students").select("*").eq("parent_id", user.id).then(({ data }) => {
        if (data) setStudents(data);
      });
    });
  }, []);

  async function addChild() {
    if (!user) return;
    await supabase.from("students").insert({
      ...form,
      parent_id: user.id,
      admission_date: new Date().toISOString().split("T")[0],
      status: "pending",
    });
    setForm({ full_name: "", class: "Playgroup", date_of_birth: "", gender: "male" });
    const { data } = await supabase.from("students").select("*").eq("parent_id", user.id);
    if (data) setStudents(data);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Children</h1>
      <Card>
        <CardHeader><CardTitle>Register a New Child</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div><Label>Class</Label>
            <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Playgroup", "Nursery", "LKG", "UKG"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></div>
          <div><Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addChild} className="w-full">Submit for Approval</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Registered Children</CardTitle></CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground">No children registered yet.</p>
          ) : (
            <div className="space-y-3">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{s.full_name}</p>
                    <p className="text-sm text-muted-foreground">{s.class} - {s.gender}</p>
                  </div>
                  <span className={`text-sm font-medium ${s.status === "active" ? "text-green-500" : s.status === "rejected" ? "text-destructive" : "text-amber-500"}`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
