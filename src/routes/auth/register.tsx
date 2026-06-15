import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MagneticButton } from "@/components/site/MagneticButton";
import { GradientText } from "@/components/site/Reveal";
import { signUp } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import pandaPlays from "@/assets/panda-plays.png";
import pandaGrows from "@/assets/panda-grows.png";
import pandaMascot from "@/assets/panda-mascot.png";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function BambooStalk({ left, height, delay }: { left: string; height: string; delay: number }) {
  return (
    <motion.div
      className={`absolute bottom-0 ${height} w-[6px] md:w-1`}
      style={{ left }}
      animate={{ rotate: [0, 2, -2, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg viewBox="0 0 8 200" className="h-full w-full" fill="none">
        <rect x="2" width="4" height="200" rx="2" className="fill-emerald-700/15" />
        {[40, 80, 120, 160].map((y) => (
          <g key={y}>
            <rect x="0" y={y-1} width="8" height="3" rx="1" className="fill-emerald-600/20" />
            <path d={`M8 ${y+1} L16 ${y-6} L15 ${y-1} Z`} className="fill-emerald-500/20" />
            <path d={`M0 ${y+1} L-7 ${y-5} L-6 ${y-1} Z`} className="fill-emerald-500/15" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirm: "",
    childName: "", childClass: "", childDob: "", childGender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await signUp(form.email, form.password, form.fullName, form.phone);
      if (form.childName && data.user) {
        await supabase.from("students").insert({
          full_name: form.childName,
          class: form.childClass || "Playgroup",
          parent_id: data.user.id,
          date_of_birth: form.childDob || new Date().toISOString().split("T")[0],
          gender: form.childGender || "male",
          admission_date: new Date().toISOString().split("T")[0],
          status: "pending",
        });
      }
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-accent/10 via-background to-primary/5 px-4">
        <div className="absolute left-[10%] top-[5%] h-28 w-36 rounded-full bg-accent/20 blur-4xl" />
        <div className="absolute right-[12%] top-[60%] h-36 w-44 rounded-full bg-primary/10 blur-4xl" />
        <motion.img
          src={pandaMascot}
          alt=""
          className="absolute left-[3%] top-[8%] w-20 opacity-20 md:w-28 md:opacity-25"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md text-center"
        >
          <div className="rounded-3xl border border-accent/10 bg-card/80 p-10 shadow-lift backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-bamboo shadow-soft">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-extrabold">Registration Submitted!</h2>
            <p className="mt-2 font-body text-muted-foreground">
              Your account is pending approval. An admin will review and activate it shortly. You will be notified once approved.
            </p>
            <div className="mt-6">
              <MagneticButton variant="primary" onClick={() => navigate({ to: "/auth/login" })}>
                Go to Sign In
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-secondary/5 px-4">
      <BambooStalk left="2%" height="h-44 md:h-60" delay={0} />
      <BambooStalk left="5%" height="h-32 md:h-44" delay={0.6} />
      <BambooStalk left="93%" height="h-40 md:h-56" delay={0.4} />
      <BambooStalk left="96%" height="h-28 md:h-38" delay={0.9} />

      <motion.img
        src={pandaPlays}
        alt=""
        className="absolute right-[6%] top-[10%] w-16 opacity-20 md:w-24 md:opacity-25"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.img
        src={pandaGrows}
        alt=""
        className="absolute left-[8%] top-[60%] w-14 opacity-15 md:w-20 md:opacity-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="absolute right-[18%] top-[6%] h-20 w-32 rounded-full bg-accent/20 blur-4xl" />
      <div className="absolute left-[12%] top-[20%] h-16 w-28 rounded-full bg-primary/10 blur-4xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-primary/10 bg-card/80 p-8 shadow-lift backdrop-blur-xl">
          <div className="mb-6 text-center">
            <h1 className="font-display text-3xl font-extrabold">
              <GradientText text="Parent Registration" />
            </h1>
              <p className="mt-1 font-body text-sm text-muted-foreground">
                Register to manage your child&apos;s preschool journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

            <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-4">
              <p className="mb-3 font-body text-xs font-semibold text-foreground/60 uppercase tracking-wider">Parent Details</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-semibold text-foreground/80">Full Name</label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-body text-sm font-semibold text-foreground/80">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-body text-sm font-semibold text-foreground/80">Phone</label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-accent/10 bg-accent/[0.02] p-4">
              <p className="mb-3 font-body text-xs font-semibold text-foreground/60 uppercase tracking-wider">Child Details</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-semibold text-foreground/80">Child&apos;s Full Name</label>
                  <Input
                    value={form.childName}
                    onChange={(e) => setForm({ ...form, childName: e.target.value })}
                    required
                    className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                    placeholder="Your child's name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-body text-sm font-semibold text-foreground/80">Class</label>
                  <Select value={form.childClass} onValueChange={(v) => setForm({ ...form, childClass: v })}>
                    <SelectTrigger className="rounded-xl border-primary/20 bg-background/50 font-body text-sm">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Playgroup", "Nursery", "LKG", "UKG"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="font-body text-sm font-semibold text-foreground/80">Date of Birth</label>
                    <Input
                      type="date"
                      value={form.childDob}
                      onChange={(e) => setForm({ ...form, childDob: e.target.value })}
                      required
                      className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-body text-sm font-semibold text-foreground/80">Gender</label>
                    <Select value={form.childGender} onValueChange={(v) => setForm({ ...form, childGender: v })}>
                      <SelectTrigger className="rounded-xl border-primary/20 bg-background/50 font-body text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-destructive/10 bg-destructive/[0.02] p-4">
              <p className="mb-3 font-body text-xs font-semibold text-foreground/60 uppercase tracking-wider">Account Security</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-semibold text-foreground/80">Password</label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                    placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-body text-sm font-semibold text-foreground/80">Confirm Password</label>
                  <Input
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    required
                    className="rounded-xl border-primary/20 bg-background/50 font-body text-sm focus-visible:ring-primary/40"
                    placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-destructive/10 px-4 py-2 font-body text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <MagneticButton type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </MagneticButton>

            <p className="text-center font-body text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/auth/login" className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary/80">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
