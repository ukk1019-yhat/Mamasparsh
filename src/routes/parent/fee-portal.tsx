import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { Student } from "@/types/database";

type StudentFee = {
  id: string;
  student_id: string;
  term: number;
  academic_year: string;
  paid_amount: number;
  due_date: string | null;
  notes: string | null;
};

export const Route = createFileRoute("/parent/fee-portal")({
  component: ParentFeePortal,
});

function ParentFeePortal() {
  const [children, setChildren] = useState<(Student & { fees: StudentFee[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: studentsData } = await supabase
        .from("students").select("*").eq("parent_id", user.id).order("full_name");
      const { data: feesData } = await supabase
        .from("student_fees").select("*").order("term");
      if (studentsData) {
        const fMap = new Map<string, StudentFee[]>();
        if (feesData) {
          for (const f of feesData as StudentFee[]) {
            if (!fMap.has(f.student_id)) fMap.set(f.student_id, []);
            fMap.get(f.student_id)!.push(f);
          }
        }
        setChildren((studentsData as Student[]).map((s) => ({
          ...s,
          fees: fMap.get(s.id) || [],
        })));
      }
      setLoading(false);
    })();
  }, []);

  const termPaidStatus = (fee?: StudentFee) => {
    if (!fee || fee.paid_amount <= 0) return { label: "Pending", color: "bg-red-100 text-red-700" as const };
    return { label: `₹${fee.paid_amount.toLocaleString()} Paid`, color: "bg-emerald-100 text-emerald-700" as const };
  };

  if (loading) return (
    <div className="flex h-60 items-center justify-center">
      <p className="font-display text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Fee Portal" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">View fee status and payment history for your children.</p>
      </motion.div>

      {children.length === 0 ? (
        <Card className="rounded-2xl border border-primary/5 shadow-soft">
          <CardContent className="py-12 text-center font-display text-muted-foreground">
            No children linked to your account.
          </CardContent>
        </Card>
      ) : (
        children.map((child) => {
          const totalFee = (child as any).total_fee || 0;
          const totalPaid = child.fees.reduce((s, f) => s + f.paid_amount, 0);
          const totalPending = totalFee - totalPaid;
          return (
            <motion.div key={child.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
                <CardHeader className="bg-gradient-to-r from-primary/[0.03] to-accent/[0.03] pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-display text-lg font-bold">{child.full_name}</CardTitle>
                      <Badge variant="outline" className="mt-1 rounded-full text-xs">{child.class}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-xs text-muted-foreground">Total Fee</p>
                      <p className="font-display text-lg font-extrabold text-primary">₹{totalFee.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-center">
                      <p className="font-body text-xs text-muted-foreground">Annual Fee</p>
                      <p className="font-display text-lg font-bold text-blue-600">₹{totalFee.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3 text-center">
                      <p className="font-body text-xs text-muted-foreground">Paid</p>
                      <p className="font-display text-lg font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3 text-center">
                      <p className="font-body text-xs text-muted-foreground">Pending</p>
                      <p className="font-display text-lg font-bold text-red-500">₹{totalPending.toLocaleString()}</p>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="font-display text-xs font-bold">Term</TableHead>
                        <TableHead className="font-display text-xs font-bold text-right">Paid</TableHead>
                        <TableHead className="font-display text-xs font-bold text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3].map((t) => {
                        const fee = child.fees.find((f) => f.term === t);
                        const st = termPaidStatus(fee);
                        return (
                          <TableRow key={t}>
                            <TableCell className="font-body font-medium">Term {t}</TableCell>
                            <TableCell className="font-body text-right text-emerald-600">₹{fee?.paid_amount?.toLocaleString() || "—"}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={`rounded-full text-[10px] font-semibold ${st.color}`}>{st.label}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="border-t-2 border-primary/20 bg-muted/10 font-semibold">
                        <TableCell className="font-display text-xs font-bold">Annual Total</TableCell>
                        <TableCell className="font-body text-right font-bold text-emerald-600">
                          ₹{totalPaid.toLocaleString()} <span className="text-muted-foreground font-normal">/ ₹{totalFee.toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`rounded-full text-[10px] font-semibold ${totalPending <= 0 ? "bg-emerald-100 text-emerald-700" : totalPaid > 0 ? "bg-amber-100 text-amber-700" : ""}`}>
                            {totalPending <= 0 ? "All Paid" : totalPaid > 0 ? "Partial" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
