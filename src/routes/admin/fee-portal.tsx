import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { GradientText } from "@/components/site/Reveal";
import { BambooBackground } from "@/components/admin/BambooBackground";
import { supabase } from "@/lib/supabase";
import type { Student } from "@/types/database";

type StudentFee = {
  id: string;
  student_id: string;
  term: number;
  academic_year: string;
  total_fee: number;
  paid_amount: number;
  due_date: string | null;
  notes: string | null;
  created_by: string;
};

type StudentWithFees = Student & {
  parent_name?: string;
  fees: StudentFee[];
};

export const Route = createFileRoute("/admin/fee-portal")({
  component: AdminFeePortal,
});

const classOptions = ["Playgroup", "Nursery", "LKG", "UKG", "Daycare"];
const terms = [1, 2, 3];

function AdminFeePortal() {
  const [students, setStudents] = useState<StudentWithFees[]>([]);
  const [classFilter, setClassFilter] = useState("all");
  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithFees | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [feeForm, setFeeForm] = useState({ total_fee: "", due_date: "" });
  const [paymentForm, setPaymentForm] = useState({ amount: "" });

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data: studentsData } = await supabase
      .from("students")
      .select("*, profiles!inner(full_name)")
      .order("class")
      .order("full_name");
    const { data: feesData } = await supabase
      .from("student_fees")
      .select("*")
      .order("term");
    if (studentsData) {
      const sMap = new Map<string, StudentFee[]>();
      if (feesData) {
        for (const f of feesData as StudentFee[]) {
          if (!sMap.has(f.student_id)) sMap.set(f.student_id, []);
          sMap.get(f.student_id)!.push(f);
        }
      }
      setStudents((studentsData as any[]).map((s) => ({
        ...s,
        parent_name: s.profiles?.full_name || "",
        fees: sMap.get(s.id) || [],
      })));
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = classFilter === "all"
    ? students
    : students.filter((s) => s.class === classFilter);

  const totalCollected = students.reduce((sum, s) =>
    sum + s.fees.reduce((t, f) => t + f.paid_amount, 0), 0);
  const totalPending = students.reduce((sum, s) => {
    const studentTotal = s.fees.reduce((t, f) => t + f.total_fee, 0);
    const studentPaid = s.fees.reduce((t, f) => t + f.paid_amount, 0);
    return sum + (studentTotal - studentPaid);
  }, 0);
  const totalFee = students.reduce((sum, s) =>
    sum + s.fees.reduce((t, f) => t + f.total_fee, 0), 0);

  function getFee(student: StudentWithFees | null, term: number) {
    return student?.fees?.find((f) => f.term === term);
  }

  function openFeeDialog(student: StudentWithFees, term: number) {
    setSelectedStudent(student);
    setSelectedTerm(term);
    const existing = getFee(student, term);
    setFeeForm({
      total_fee: existing?.total_fee?.toString() || "",
      due_date: existing?.due_date?.split("T")[0] || "",
    });
    setFeeDialogOpen(true);
  }

  async function saveFee() {
    if (!selectedStudent) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const existing = getFee(selectedStudent, selectedTerm);
    const record = {
      student_id: selectedStudent.id,
      term: selectedTerm,
      academic_year: "2026-27",
      total_fee: parseFloat(feeForm.total_fee) || 0,
      due_date: feeForm.due_date || null,
      created_by: user.id,
    };
    if (existing) {
      await supabase.from("student_fees").update(record).eq("id", existing.id);
    } else {
      await supabase.from("student_fees").insert({ ...record, paid_amount: 0 });
    }
    setFeeDialogOpen(false);
    load();
  }

  async function deleteFee(feeId: string) {
    await supabase.from("student_fees").delete().eq("id", feeId);
    load();
  }

  function openPaymentDialog(student: StudentWithFees, term: number) {
    setSelectedStudent(student);
    setSelectedTerm(term);
    setPaymentForm({ amount: "" });
    setPaymentDialogOpen(true);
  }

  async function recordPayment() {
    if (!selectedStudent) return;
    const existing = getFee(selectedStudent, selectedTerm);
    if (!existing) return;
    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) return;
    const newPaid = existing.paid_amount + amount;
    if (newPaid > existing.total_fee) {
      alert("Payment exceeds total fee.");
      return;
    }
    await supabase.from("student_fees").update({ paid_amount: newPaid }).eq("id", existing.id);
    setPaymentDialogOpen(false);
    load();
  }

  async function reversePayment(studentId: string, term: number) {
    const existing = students.find((s) => s.id === studentId)?.fees.find((f) => f.term === term);
    if (!existing || existing.paid_amount <= 0) return;
    const amount = parseFloat(prompt("Amount to reverse:") || "0");
    if (isNaN(amount) || amount <= 0 || amount > existing.paid_amount) return;
    const newPaid = existing.paid_amount - amount;
    await supabase.from("student_fees").update({ paid_amount: newPaid }).eq("id", existing.id);
    load();
  }

  const feeStatus = (fee?: StudentFee) => {
    if (!fee) return { label: "Not Set", color: "bg-gray-100 text-gray-600" as const };
    const pending = fee.total_fee - fee.paid_amount;
    if (pending <= 0) return { label: "Paid", color: "bg-emerald-100 text-emerald-700" as const };
    if (fee.paid_amount > 0) return { label: `Partial ₹${pending.toLocaleString()}`, color: "bg-amber-100 text-amber-700" as const };
    return { label: `₹${pending.toLocaleString()} Pending`, color: "bg-red-100 text-red-700" as const };
  };

  return (
    <div className="relative space-y-6">
      <BambooBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          <GradientText text="Fee Portal" />
        </h1>
        <p className="mt-1 font-body text-muted-foreground">Manage fees across 3 terms. Track payments, record receipts, and monitor pending dues.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="font-body text-sm font-semibold text-muted-foreground">Total Fee Set</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-extrabold text-primary">₹{totalFee.toLocaleString()}</p></CardContent>
        </Card>
        <Card className="rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="font-body text-sm font-semibold text-muted-foreground">Total Collected</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-extrabold text-emerald-600">₹{totalCollected.toLocaleString()}</p></CardContent>
        </Card>
        <Card className="rounded-2xl border border-primary/5 shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="font-body text-sm font-semibold text-muted-foreground">Total Pending</CardTitle></CardHeader>
          <CardContent><p className="font-display text-2xl font-extrabold text-red-500">₹{totalPending.toLocaleString()}</p></CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-xl font-bold">Students</h2>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-40 rounded-xl border-primary/20">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classOptions.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-primary/5 shadow-soft">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-display text-xs font-bold">Student</TableHead>
                <TableHead className="font-display text-xs font-bold">Class</TableHead>
                <TableHead className="font-display text-xs font-bold">Parent</TableHead>
                {terms.map((t) => (
                  <TableHead key={t} className="font-display text-xs font-bold text-center">Term {t}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/20">
                  <TableCell className="font-body font-medium">{student.full_name}</TableCell>
                  <TableCell><Badge variant="outline" className="rounded-full text-xs">{student.class}</Badge></TableCell>
                  <TableCell className="font-body text-xs text-muted-foreground">{student.parent_name}</TableCell>
                  {terms.map((t) => {
                    const fee = getFee(student, t);
                    const st = feeStatus(fee);
                    return (
                      <TableCell key={t} className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Badge className={`rounded-full text-[10px] font-semibold cursor-pointer ${st.color}`}
                            onClick={() => openFeeDialog(student, t)}
                            title="Set/edit fee">
                            {st.label}
                          </Badge>
                          {fee && fee.paid_amount < fee.total_fee && (
                            <button
                              onClick={() => openPaymentDialog(student, t)}
                              className="rounded-full bg-primary/10 p-1 text-[10px] text-primary hover:bg-primary/20"
                              title="Record payment">+</button>
                          )}
                          {fee && fee.paid_amount > 0 && (
                            <button
                              onClick={() => reversePayment(student.id, t)}
                              className="rounded-full bg-red-100 p-1 text-[10px] text-red-600 hover:bg-red-200"
                              title="Reverse payment">−</button>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-8 text-center font-body text-muted-foreground">No students found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={feeDialogOpen} onOpenChange={setFeeDialogOpen}>
        <DialogContent className="rounded-2xl border-primary/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold">
              <GradientText text={`${selectedStudent?.full_name || ""} – Term ${selectedTerm} Fee`} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold">Total Fee (₹)</Label>
              <Input type="number" min="0" step="0.01" value={feeForm.total_fee}
                onChange={(e) => setFeeForm({ ...feeForm, total_fee: e.target.value })}
                className="rounded-xl border-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold">Due Date (optional)</Label>
              <Input type="date" value={feeForm.due_date}
                onChange={(e) => setFeeForm({ ...feeForm, due_date: e.target.value })}
                className="rounded-xl border-primary/20" />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveFee} className="flex-1 rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">
                Save
              </Button>
              {getFee(selectedStudent!, selectedTerm) && (
                <Button variant="destructive" onClick={() => {
                  const fee = getFee(selectedStudent!, selectedTerm);
                  if (fee) { deleteFee(fee.id); setFeeDialogOpen(false); }
                }} className="rounded-xl font-display font-bold">
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="rounded-2xl border-primary/10">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold">
              <GradientText text={`Record Payment – ${selectedStudent?.full_name || ""} Term ${selectedTerm}`} />
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (() => {
            const fee = getFee(selectedStudent, selectedTerm);
            if (!fee) return null;
            const pending = fee.total_fee - fee.paid_amount;
            return (
              <div className="space-y-4">
                <div className="flex justify-between rounded-xl bg-muted/30 p-3 text-sm">
                  <span className="font-body text-muted-foreground">Total Fee</span>
                  <span className="font-body font-semibold">₹{fee.total_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between rounded-xl bg-muted/30 p-3 text-sm">
                  <span className="font-body text-muted-foreground">Already Paid</span>
                  <span className="font-body font-semibold text-emerald-600">₹{fee.paid_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between rounded-xl bg-red-50 p-3 text-sm">
                  <span className="font-body text-muted-foreground">Pending</span>
                  <span className="font-body font-bold text-red-500">₹{pending.toLocaleString()}</span>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold">Payment Amount (₹)</Label>
                  <Input type="number" min="0.01" max={pending} step="0.01" value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ amount: e.target.value })}
                    className="rounded-xl border-primary/20" />
                </div>
                <Button onClick={recordPayment} disabled={!paymentForm.amount || parseFloat(paymentForm.amount) <= 0}
                  className="w-full rounded-xl bg-gradient-bamboo font-display font-bold text-white shadow-soft">
                  Record Payment
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
