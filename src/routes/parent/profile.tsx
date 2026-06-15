import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
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
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="My Children" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Register and manage your children.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Register a New Child</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold">Full Name</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="rounded-xl border-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold">Class</Label>
              <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
                <SelectTrigger className="rounded-xl border-primary/20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Playgroup", "Nursery", "LKG", "UKG"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold">Date of Birth</Label>
              <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="rounded-xl border-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold">Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger className="rounded-xl border-primary/20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addChild} className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft hover:shadow-lift">
              Submit for Approval
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="bg-gradient-to-r from-sky-400/10 to-transparent">
            <CardTitle className="font-display text-lg font-bold">Registered Children</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="py-8 text-center font-display text-muted-foreground">No children registered yet.</p>
            ) : (
              <div className="space-y-3">
                {students.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl border border-primary/5 bg-gradient-to-r from-primary/[0.02] to-transparent p-4 transition-colors hover:from-primary/5">
                    <div>
                      <p className="font-display font-bold">{s.full_name}</p>
                      <p className="font-body text-xs text-muted-foreground">{s.class} - {s.gender}</p>
                    </div>
                    <Badge variant={s.status === "active" ? "default" : s.status === "rejected" ? "destructive" : "secondary"} className="rounded-full font-body text-xs">
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
